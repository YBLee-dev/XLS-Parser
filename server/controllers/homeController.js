const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  endpoint: `s3-${process.env.S3_REGION}.amazonaws.com`,// Put you region
  accessKeyId: process.env.S3_ACCESS_KEY, // Put you accessKeyId
  secretAccessKey: process.env.S3_SECRET_KEY,
  Bucket: process.env.S3_BUCKET_NAME, // Put your bucket name
  signatureVersion: 'v4',
  region: process.env.S3_REGION // Put you region
});
const axios = require('axios');
const xlsx = require('xlsx');

// async function getDownloadPresignedUrl(fileName) {
//   const params = {
//     Bucket: 'ems-excel-parser',
//     Key: fileName,
//     Expires: 600 * 5
//   };
//   try {
//     const url = await new Promise((resolve, reject) => {
//       s3.getSignedUrl('getObject', params, (err, url) => {
//         err ? reject(err) : resolve(url);
//       });
//     });
//     return url;
//   } catch (err) {
//     if (err) {
//       console.log(err)
//       return false;
//     }
//   }
// }

const sendOrderReq = function ({ name, address, mobileNo, phoneNo }) {
  return axios.post(
    'https://tgb6wardbf.execute-api.ap-southeast-1.amazonaws.com/dev/v1/orders',
    {
      "shippingMethod": "thaipost",
      "codAmount": "100",
      "weight": "500",
      "customer": {
        "name": name,
        "address": address,
        "mobileNo": mobileNo,
        "phoneNo": phoneNo,
        "salesChannel": "facebook",
        "email": ""
      },
      "shopId": "shop-f8576240-20c3-11eb-99b6-47f9099947ca1604731162212",
      "remarks": ""
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.AuthToken}`,
        'Accept': 'application/json'
      },
    }
  ).then(() => {
    return true;
  }).catch((err) => {
    console.error(err);
    return false;
  });
}

const parseAddress = function (text) {
  return axios.get('https://iwjkvg2m94.execute-api.ap-southeast-1.amazonaws.com/dev/parse-address', {
    headers: {
      'Authorization': `Bearer ${process.env.AuthToken}`,
      'Accept': 'application/json'
    },
    params: {
     text
    }
  }).then(({ data }) => {
    return {
      isValid: (data['nameAddress'] !== '') && data['provinceMatched'] && data['districtMatched']
        && data['subdistrictMatched'] && data['zipcodeMatched'] && (data['phone'] !== ''),
      data
    }
  }).catch((err) => {
    console.error(err);
    return {
      isValid: false,
      data: {
        inputText: "",
        nameAddress: "",
        subdistrictName: "",
        districtName: "",
        provinceName: "",
        zipcode: "",
        phone: ""
      }
    };
  });
}

const callRequest = async function (data) {
  let result = {"success": 0, "failed": []};
  for (const item of data) {
    const name = item[1];
    const text = item.join('\n');
    const orderData = await parseAddress(text);

    if (orderData.isValid) {
      if (await sendOrderReq({
        name,
        address: {
          address: orderData.data['nameAddress'].replace('\n', ' '),
          province: orderData.data['provinceName'],
          district: orderData.data['districtName'],
          subDistrict: orderData.data['subdistrictName'],
          zipcode: orderData.data['zipcode'],
        },
        mobileNo: orderData.data['phone'],
        phoneNo: orderData.data['phone'],
      })) {
        result.success ++;
      } else {
        result.failed.push({
          name,
          ...orderData.data
        });
      }
    } else {
      result.failed.push({
        name,
        ...orderData.data
      });
    }
  }

  return result;
}

module.exports = {
  handleManualSendRequest: async function (req, res) {
    const { data } = req.body;
    const result = {"success": 0, "failed": []};

    for (const item of data) {
      try {
        const isSuccess = await sendOrderReq({
          name: item.name,
          address: {
            address: item.address,
            province: item.province,
            district: item.district,
            subDistrict: item.subDistrict,
            zipcode: item.zip,
          },
          mobileNo: item.phone,
          phoneNo: item.phone,
        });
        if (isSuccess) {
          result.success ++;
        } else {
          result.failed.push(item);
        }
      } catch (e) {
        console.error(e);
        result.failed.push(item);
      }
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  },

  handleFileUpload: function (req, res) {
    const dateObj = new Date();
    const year    = dateObj.getFullYear();
    const month   = dateObj.getMonth();
    const day     = dateObj.getDate();
    const hour    = dateObj.getHours();
    const min     = dateObj.getMinutes();
    const second  = dateObj.getSeconds();

    const now     = `${year}-${month}-${day}_${hour}-${min}-${second}`;
    const fileName = now + '.xlsx';

    return s3.getSignedUrl('putObject', {
      Bucket: 'ems-excel-parser',
      Key: fileName,
      Expires: 60 * 5,
    }, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err });
      }

      return axios.put(url, req.file.buffer, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }).then(async () => {
        const wb = xlsx.read(req.file.buffer, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws);

        let parsedArray = [];
        for (const key in data) {
          if (key === '0') {
            parsedArray[key] = Object.keys(data[key]);
          }
          parsedArray.push(Object.values(data[key]));
        }

        // send Request
        const result = await callRequest(parsedArray)

        return res.status(200).json({
          success: true,
          data: result
        });
      }).catch((err) => {
        console.error(err);
        return res.status(500).json({ success: false });
      });
    });
  }
};

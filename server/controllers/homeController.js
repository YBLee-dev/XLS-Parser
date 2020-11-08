const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  endpoint: 's3-ap-southeast-1.amazonaws.com',// Put you region
  accessKeyId: 'AKIAXCJT4UJR6OPVOIVJ',       // Put you accessKeyId
  secretAccessKey: 'xD/r4gtE/lT+g+AeI13MQbNIRQEH3fdBuTP0yG5h',   // Put you accessKeyId
  Bucket: 'ems-excel-parser',         // Put your bucket name
  signatureVersion: 'v4',
  region: 'ap-southeast-1'           // Put you region
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

const sendRequest = function (RequestTxt) {
  const url = 'https://iwjkvg2m94.execute-api.ap-southeast-1.amazonaws.com/dev/parse-address';
  return axios.get(url, {
    headers: {
      'Authorization': process.env.AuthToken,
      'Accept': 'application/json'
    },
    params: {
     text: RequestTxt
   }
  }).then(async (res) => {
   return true;
  }).catch((err) => {
   console.error(err);
   return false;
  });
}

const callRequest = async function (reqArray) {
  let result = {"success": 0, "failed": []};
  for (const key in reqArray) {
    const reqText = reqArray[key].join('\n');
    const reqResult = await sendRequest(reqText);

    if (reqResult) {
      result.success ++;
    } else {
      result.failed.push(reqResult[key]);
    }
  }

  return result;
}

module.exports = {
  handleManualSendRequest: async function (req, res) {
    const reqArray = req.body;
    const result = await callRequest(reqArray);

    return res.status(200).json({
      success: true,
      data: result
    });
  },

  handleFileUpload: function (req, res) {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    const now = `${year}-${month}-${day}_${hour}-${min}-${second}`;
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

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  endpoint: 's3-ap-southeast-1.amazonaws.com',// Put you region
  accessKeyId: 'AKIAXCJT4UJR6OPVOIVJ',       // Put you accessKeyId
  secretAccessKey: 'xD/r4gtE/lT+g+AeI13MQbNIRQEH3fdBuTP0yG5h',   // Put you accessKeyId
  Bucket: 'ems-excel-parser',         // Put your bucket name
  signatureVersion: 'v4',
  region: 'ap-southeast-1'           // Put you region
});
const axios = require("axios");
const readXlsxFile = require('read-excel-file/node');

async function getDownloadPresignedUrl(fileName) {
  const params = {
    Bucket: 'ems-excel-parser',
    Key: fileName,
    Expires: 600 * 5
  };
  try {
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    });
    return url;
  } catch (err) {
    if (err) {
      console.log(err)
      return false;
    }
  }
}

async function parseXlsx(fileUrl) {
  const rows = await readXlsxFile(fileUrl)
  return rows;
}

async function getXlsParseResponse (fileName) {
  //get download presideurl
  let fileUrl = await getDownloadPresignedUrl(fileName);

  console.log('got presigned fileUrl', fileUrl);

  return await parseXlsx(fileUrl);
}

module.exports = {
  getParsedRes: async function (req, res) {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    const now = `${year}-${month}-${day}_${hour}-${min}-${second}`;
    const fileName = now + '.xlsx';
    console.log('seted fileName', fileName);

    async function getSingedUrlforPut() {
      const params = {
        Bucket: 'ems-excel-parser',
        Key: fileName,
        Expires: 60 * 5
      };

      try {
        return await new Promise((resolve, reject) => {
          s3.getSignedUrl('putObject', params, (err, url) => {
            err ? reject(err) : resolve(url);
          });
        });
      } catch (err) {
        if (err) {
          console.log(err);
          return false;
        }
      }
    }

    const preSignedUrl = await getSingedUrlforPut();
    console.log('got presinged url', preSignedUrl);
    console.log('start upload s3 by presigned url');
    await axios.put(preSignedUrl, req.body, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    }).then(async () => {
      console.log('uploaded s3 by presigned url');

      console.log("start parse")
      const result = await getXlsParseResponse(fileName);
      console.log("end parse");

      return res.status(200).json({result: result});
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({success: false});
    });
  }
};

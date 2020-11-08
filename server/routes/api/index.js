const { homeController } = require("../../controllers");
const multer = require('multer');
const upload = multer();

module.exports = (router) => {
    router.post("/api/v1/get-parse", upload.single('file'), homeController.handleFileUpload);
    router.post("/api/v1/send-manual-req", homeController.handleManualSendRequest);
};

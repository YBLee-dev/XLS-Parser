const { homeController } = require("../../controllers");


module.exports = (router) => {
    router.post("/api/v1/get-parse", homeController.getParsedRes);
};

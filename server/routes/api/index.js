const { homeController } = require("../../controllers");

module.exports = (router) => {
    router.get("/api/v1/home", homeController.getSuccessResponse);
};

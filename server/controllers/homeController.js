module.exports = {
  getSuccessResponse: function (req, res) {
    return res.status(200).json({ result: "success" });
  },
};

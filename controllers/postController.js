const { response } = require("../app");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post");
};

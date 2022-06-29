// Controllers handles the functions used in a route.
// It is much cleaner to do it this way than have a massive router page.

const User = require("../models/User");

exports.login = function (req, res) {
  let user = new User(req.body, res);
  user
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username };
      res.send(result);
    })
    .catch(function (err) {
      res.send(err);
    });
};

exports.logout = () => {};

exports.register = (req, res) => {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("There are no errors.");
  }
};

exports.home = (req, res) => {
  if (req.session.user) {
    res.send("Welcome to the application");
  } else {
    res.render("home-guest");
  }
};

// Controllers handles the functions used in a route.
// It is much cleaner to do it this way than have a massive router page.

const { serializeWithBufferAndIndex } = require("bson");
const { response } = require("../app");
const User = require("../models/User");

exports.login = (req, res) => {
  let user = new User(req.body, res);
  user
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.logout = async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
};

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
    // Second argument is any just data which can be passed through
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest", { errors: req.flash("errors") });
  }
};

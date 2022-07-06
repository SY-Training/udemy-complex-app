// Controllers handles the functions used in a route.
// It is much cleaner to do it this way than have a massive router page.

const { serializeWithBufferAndIndex } = require("bson");
const { response } = require("../app");
const User = require("../models/User");

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next(); // Next will call the next function in the route for "/create-post"
  } else {
    req.flash("errors", "You must be logged in to perform that action.");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.login = (req, res) => {
  let user = new User(req.body, res);
  user
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username, _id: user.data._id };
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
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username, _id: user.data._id };
      req.session.save(() => {
        //session.save will save session info, allowing for database queries to run.
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach((err) => {
        req.flash("regErrors", err); // First param is new array, second is item to push into array.
      });
      req.session.save(() => {
        //session.save will save session info, allowing for database queries to run.
        res.redirect("/");
      });
    });
};

exports.home = (req, res) => {
  if (req.session.user) {
    // Second argument is any just data which can be passed through
    res.render("home-dashboard");
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};

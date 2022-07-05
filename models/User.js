// Constructor function for new users.
const userCollection = require("../db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

// User.prototype means all objects point back to this one instance. Soe there is only one instance of the method
// in memory, which is more efficient as there won't be multiple instances of the same method.

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // Get rid of any bogus properties, so if object data other than the 3 below was submitted,
  // it would be removed.
  this.data = {
    username: this.data.username.trim().toLowerCase(), // .trim() removes white space.
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = async function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide an email address");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password");
  }
  if (this.data.password.length < 1 && this.data.password.length > 12) {
    this.errors.push("Password mut be between 1 and 12 characters.");
  }

  // Only if USERNAME is valid, then check to see if it's taken.
  if (
    this.data.username.length > 2 &&
    this.data.username.length < 15 &&
    validator.isAlphanumeric(this.data.username)
  ) {
    let usernameExists = await userCollection.findOne({
      username: this.data.username,
    });
    if (usernameExists) {
      this.errors.push("That username is already");
    }
  }

  // Only if EMAIL is valid, then check to see if it's taken.
  if (validator.isEmail(this.data.email)) {
    let emailExists = await userCollection.findOne({
      username: this.data.email,
    });
    if (emailExists) {
      this.errors.push("That email is already");
    }
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    userCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          resolve("contgrats");
        } else {
          reject("invalid password");
        }
      })
      .catch(function () {
        reject("please try again later.");
      });
  });
};

User.prototype.register = function () {
  // step 1 - validate user data.
  this.cleanUp();
  this.validate();
  // step 2 - only if there are no validation errors
  //          then save user data into DB.
  if (!this.errors.length) {
    // has user password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    userCollection.insertOne(this.data);
  }
};

module.exports = User;

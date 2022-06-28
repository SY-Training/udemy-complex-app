// Constructor function for new users.
const userCollection = require("../db").collection("users");
const validator = require("validator");

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

User.prototype.validate = function () {
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
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    userCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (attemptedUser && attemptedUser.password == this.data.password) {
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
    userCollection.insertOne(this.data);
  }
};

module.exports = User;

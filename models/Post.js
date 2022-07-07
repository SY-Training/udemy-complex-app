const { ObjectId } = require("mongodb");

// See User.js for format comments.
const postsCollection = require("../db").db().collection("posts"); // DB is a reusable file which uses the DB.
// Adding the collection("posts") creates the DB automatically.
const objectID = require("mongodb").ObjectId;

let Post = function (data, userId) {
  this.data = data;
  this.errors = []; // Added this array so it's available to push potential future errors.
  this.userId = userId;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }
  // Get rid of bogus props
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: objectID(this.userId),
  };
};
Post.prototype.validate = function () {
  if (this.data.title === "") {
    this.errors.push("You must provide a title.");
  }
  if (this.data.title === "") {
    this.errors.body("You must provide content to post.");
  }
};
Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      postsCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push("Please try again later.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

// Find a post
Post.findSingleById = function (id) {
  return new Promise(async function (resolve, reject) {
    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      // if typeof is not string, performs some validation checking.
      reject();
      return;
    }
    let posts = await postsCollection
      .aggregate([
        { $match: { _id: new objectID(id) } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDocument",
          },
        },
      ])
      .toArray();

    // clean up author property.
    posts = posts.map((post) => {
      post.author = {
        username: post.author.username,
      };
      return post;
    });

    if (posts.length) {
      console.log(posts[0]);
      resolve(posts[0]);
    } else {
      reject();
    }
  });
};

module.exports = Post;

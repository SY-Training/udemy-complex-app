const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");

// Remember: POST and GET requests are initiated by a <form> element in the HTML files.
// This is than handled by the router.

const app = express();
// boilerplate code in below object.
let sessionOptions = session({
  secret: "javascript",
  store: mongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);

const router = require("./router.js");

// Boilerplate code to tell express to get data from the HTMl form body.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public")); // static is for css. the css files are in the public folder
app.set("views", "views"); // first views is an express method, second is the name of the folder containing HTML.
app.set("view engine", "ejs"); // setting a view engine for templates. Ejs is the engine.

app.use("/", router);

module.exports = app;

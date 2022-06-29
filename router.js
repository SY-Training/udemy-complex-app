const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");

// Rather than render the page in here, import a controller and render the page via imported function. Cleaner code.
// In this case everything is being sent to the userController file.
router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;

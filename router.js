const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController')

// Rather than render the page in here, import a controller and render the page via imported function. Cleaner code.
router.get('/', userController.home);
router.post('/register', userController.register);



module.exports = router;
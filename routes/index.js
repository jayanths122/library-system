const express = require('express'),
    router = express.Router(),
    { home, register, doRegister, login, adminLogin, doLogin, doLoginAdmin, logout } = require("../controller/authController");

// restrict index for logged in user only
router.get('/', home);

// route to register page
router.get('/register', register);

// route for register action
router.post('/register', doRegister);

// route to login page
router.get('/userLogin', login);

// route to login page
router.get('/adminLogin', adminLogin);

// route for login action
router.post('/login', doLogin);

// router to admin login action
router.post('/doLoginAdmin', doLoginAdmin);

// route for logout action
router.get('/logout', logout);

module.exports = router;

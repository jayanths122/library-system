const express = require('express'),
    router = express.Router(),
    { home, register, doRegister, login, adminLogin, doLogin, doLoginAdmin, logout } = require("../controller/authController");

// restrict index for logged in user only
router.get('/', home);

// Route to load register page
router.get('/register', register);

// Route for register action
router.post('/register', doRegister);

// Route to load user login page
router.get('/userLogin', login);

// Route to load admin login page 
router.get('/adminLogin', adminLogin);

// Route for user login action
router.post('/login', doLogin);

// router for admin login action
router.post('/doLoginAdmin', doLoginAdmin);

// route for logout action
router.get('/logout', logout);

module.exports = router;

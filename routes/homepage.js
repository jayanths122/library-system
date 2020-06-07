const express = require('express');
const router = express.Router();
const { getHomePage } = require('../controller/homePageController');

router.get('/homepage', getHomePage);

module.exports = router;
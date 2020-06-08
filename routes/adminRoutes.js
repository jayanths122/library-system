const express = require('express'),
      router = express.Router(),
      { isAdmin } = require('../authCheck/authenticate'),
      { approveIssue, rejectIssue, adminProfile } = require('../controller/adminController');

// Route to load admin profile       
router.get('/profile', isAdmin, adminProfile); 

// Route tp approve issue requests
router.get('/approveIssue', isAdmin, approveIssue);

// Route to reject requests
router.get('/rejectIssue', isAdmin, rejectIssue);

module.exports = router;
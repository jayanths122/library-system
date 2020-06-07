const express = require('express'),
      router = express.Router(),
      { isAdmin } = require('../authCheck/authenticate'),
      { approveIssue, rejectIssue, adminProfile } = require('../controller/adminController');

router.get('/profile', isAdmin, adminProfile);      
router.get('/approveIssue', isAdmin, approveIssue);
router.get('/rejectIssue', isAdmin, rejectIssue);

module.exports = router;
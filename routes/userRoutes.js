const express = require('express'),
      router = express(),
      { isLoggedIn } = require('../authCheck/authenticate'),
      { requestIssue, returnBook, userProfile, updateProfile, deleteActivities } = require('../controller/userController');

router.get('/requestIssue', isLoggedIn, requestIssue);
router.get('/returnBook', isLoggedIn, returnBook);
router.get('/profile', isLoggedIn, userProfile);
router.get('/deleteActivities', isLoggedIn, deleteActivities);
router.post('/updateProfile', isLoggedIn, updateProfile);

module.exports = router;    
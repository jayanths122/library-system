const express = require('express'),
      router = express(),
      { isLoggedIn, isNotAdmin } = require('../authCheck/authenticate'),
      { requestIssue, returnBook, userProfile, updateProfile, deleteActivities } = require('../controller/userController');

// Route make request for issuing a book      
router.get('/requestIssue', isLoggedIn, requestIssue);

// Route to return a book back to library
router.get('/returnBook', isLoggedIn, returnBook);

// Route to load user profile
router.get('/profile', isNotAdmin, userProfile);

// Route to delete all user activities
router.get('/deleteActivities', isLoggedIn, deleteActivities);

// Route to update user details
router.post('/updateProfile', isLoggedIn, updateProfile);

module.exports = router;    
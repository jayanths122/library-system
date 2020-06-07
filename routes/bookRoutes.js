const express = require('express'),
      router = express.Router(),
      { isAdmin, isLoggedIn } = require('../authCheck/authenticate'),
      { addBook, editBook, deleteBook, getBookDetails } = require('../controller/bookController');

router.post('/addBook', isAdmin, addBook);
router.post('/editBook', isAdmin, editBook);
router.get('/deleteBook', isAdmin, deleteBook);
router.get('/details', isLoggedIn, getBookDetails);

module.exports = router;
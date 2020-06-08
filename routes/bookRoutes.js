const express = require('express'),
      router = express.Router(),
      { isAdmin, isLoggedIn } = require('../authCheck/authenticate'),
      { addBook, editBook, deleteBook, getBookDetails } = require('../controller/bookController');

// Route to add book      
router.post('/addBook', isAdmin, addBook);

// Route to update book details
router.post('/editBook', isAdmin, editBook);

//Route to delete book
router.get('/deleteBook', isAdmin, deleteBook);

// Route to get book details 
router.get('/details', isLoggedIn, getBookDetails);

module.exports = router;
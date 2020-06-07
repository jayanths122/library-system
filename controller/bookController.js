const Book = require('../models/Book'),
      uuid = require('uuid');

class BookController {
    constructor() {}

    async getBookDetails(req, res, next) {
        try {
            const details = await Book.findById({ _id: req.query.book_id });
            res.render('book/details', { details });
        } catch (error) {
            console.log(error);
            res.redirect('back'); 
        }
    }

    async addBook(req, res, next) {
        const { title, author, description, stock } = req.body;
        try {
            const book = new Book({
                title, 
                author,
                description,
                stock,
                bookId: uuid.v4()
            });
            await book.save();

            res.redirect('/admin/profile?page=manage');

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }

    async getAllBooks() {
        // const page = req.params.page || 1;
        try {
            const books = await Book.find({});
            
            if (books) {
                return books;
            } 

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async editBook(req, res, next) {
        try {
            const { bookId, title, author, description, stock, issuable, readable } = req.body;

            await Book
                .updateOne({ bookId }, { title, author, description, stock, issuable: (issuable && issuable === 'on'), readable: (readable && readable === 'on')  });

            res.redirect('/admin/profile?page=manage');

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }

    async deleteBook(req, res, next) {
        const { bookId } = req.query;
        try {
                        
            const book = await Book.findOne({ bookId });

            const Request = require('../models/Request'),
                  Issue = require('../models/Issue');

            const issue = await Issue.find({ 'book_info.id': book._id });
            const request = await Request.find({ 'book_info.id': book._id });

            if (issue || request) {
                return res.redirect('/admin/profile?page=home');
            }
            
            await Book.deleteOne({ _id: book._id });
            res.redirect('/admin/profile?page=manage');

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }
}

module.exports = new BookController();
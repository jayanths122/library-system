const Book = require('../models/Book'),
      uuid = require('uuid');

class BookController {
    constructor() {}

    /**
     * Fetched book based on book ID.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async getBookDetails(req, res) {
        try {
            const details = await Book.findById({ _id: req.query.book_id });
            res.render('book/details', { details });
        } catch (error) {
            console.log(error);
            res.redirect('back'); 
        }
    }


    /**
     * Adds book to library.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async addBook(req, res) {
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

            res.redirect('/admin/profile?page=manage&scsMsg=Successfully added a new book');

        } catch (error) {
            console.log(error);
            res.redirect(`/admin/profile?page=manage&errMsg=${error.message}`);
        }
    }


    /**
     * Fetches all the books in the library.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
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


    /**
     * Edits the details of a single book.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async editBook(req, res) {
        try {
            const { bookId, title, author, description, stock, issuable, readable } = req.body;

            await Book
                .updateOne({ bookId }, { title, author, description, stock, issuable: (issuable && issuable === 'on'), readable: (readable && readable === 'on')  });

            res.redirect('/admin/profile?page=manage&scsMsg=Book updation successful');

        } catch (error) {
            console.log(error);
            res.redirect(`/admin/profile?page=manage&errMsg=${error.message}`);
        }
    }


    /**
     * Deletes a single book.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async deleteBook(req, res) {
        const { bookId } = req.query;
        try {
                        
            const book = await Book.findOne({ bookId });

            const Request = require('../models/Request'),
                  Issue = require('../models/Issue');

            const issue = await Issue.find({ 'book_info.id': book._id });
            const request = await Request.find({ 'book_info.id': book._id });

            if (issue.length || request.length) {
                return res.redirect('/admin/profile?page=manage&errMsg="Cannot delete a book that has already been requested/issued');
            }
            
            await Book.deleteOne({ _id: book._id });
            res.redirect('/admin/profile?page=manage&scsMsg=Book deletion successfully');

        } catch (error) {
            console.log(error);
            res.redirect(`/admin/profile?page=manage&errMsg=${error.message}`);
        }
    }
}

module.exports = new BookController();
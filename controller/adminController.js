const User = require('../models/User'),
      Book = require('../models/Book'),
      Request = require('../models/Request'),
      Issue = require('../models/Issue'),
      Activity = require('../models/Activity'),
      { validTime } = require('../utilities/validTime');

class AdminController {
    constructor() {}

    /**
     * Renders the admin profile.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
     */
    async adminProfile(req, res, next) {
        try {
            
            // Get all the books and the issue requests made to the admin
            const books = await Book.paginate({}, { page: 1, limit: 10 });
            const requests = await Request.find({});
             
            // Render the profile
            return res.render('admin/profile', {
                userInfo: req.user,
                books: books.docs,
                requests,
                page: req.query.page,
                error: {
                    message: req.query.errMsg || ''
                },
                success: {
                    message: req.query.scsMsg || ''
                }
            });

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }


    /**
     * Approves each issue request.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
     */
    async approveIssue(req, res, next) {
        const { user_id, book_id } = req.query;

        try {
            // Get the the info about the book to be issued and also the user requesting for it
            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });  

            // Only issue requests between 9 and 5 PM
            if (!validTime()) {
                return res.redirect('/admin/profile?page=requests&errMsg=Books can only be issued between 9 AM and 5 PM');
            }
            
            // Make sure the book is in stock
            if (book.stock < 1) {
                return res.redirect('/admin/profile?page=requests&errMsg=Book out of stock');
            }
            
            // Remove the request and add an issue for the user 
            await Request.findOneAndDelete({ 'user_id.id': user._id, 'book_info.id': book._id });
            let bookIndex = -1;
            user.requestDetails.forEach((element, index) => {
                if (book._id.toString() == element._id.toString()){ 
                    bookIndex = index;                   
                }
            });
            user.requestDetails.splice(bookIndex, 1);
            // Decrement the stock once the book is issued 
            book.stock -= 1;

            const { _id, title, author, bookId, stock } = book; 
            const issue = new Issue({
                book_info: {
                    id: _id,
                    title,
                    author,
                    bookId,
                    stock
                },
                user_id: {
                    id: user._id,
                    username: `${user.firstName} ${user.lastName}`,
                }
            });
            user.issueDetails.push(book._id);
            
            // Make a log of both activities
            const activity = new Activity({
                info: {
                    id: book._id,
                    title: book.title,
                },
                category: "Issue",
                issue_time: {
                    id: issue._id,
                    issueDate: issue.book_info.issueDate,
                    returnDate: issue.book_info.returnDate,
                },
                user_id: {
                    id: user._id,
                    username: `${user.firstName} ${user.lastName}`,
                }
            });

            // Make all updates in parallel
            await Promise.all([
                user.save(),
                book.save(),
                issue.save(),
                activity.save()
            ]); 

            res.redirect('/admin/profile?page=requests&scsMsg=Book issued successfully');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }


    /**
     * Disapproves/rejects each issue request.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
     */
    async rejectIssue(req, res, next) {
        const { user_id, book_id } = req.query;
        try {
            // Get the the info about the book to be issued and also the user requesting for it
            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });   
            
            // Find and remove the request
            await Request.findOneAndDelete({ 'user_id.id': user._id, 'book_info.id': book_id });
            let bookIndex = -1;
            user.requestDetails.forEach((element, index) => {
                if (book._id.toString() == element._id.toString()){ 
                    bookIndex = index;                   
                }
            });
            user.requestDetails.splice(bookIndex, 1);

            await Promise.all([
                user.save(),
                book.save()
            ]); 

            res.redirect('/admin/profile?page=requests&scsMsg=Request rejected');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
}

module.exports = new AdminController();
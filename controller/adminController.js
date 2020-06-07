const User = require('../models/User'),
      Book = require('../models/Book'),
      Request = require('../models/Request'),
      Issue = require('../models/Issue'),
      Activity = require('../models/Activity');

class AdminController {
    constructor() {}

    async adminProfile(req, res, next) {
        try {
            
            const books = await Book.paginate({}, { page: 1, limit: 10 });
            const requests = await Request.find({});
             
            return res.render('admin/profile', {
                userInfo: req.user,
                books: books.docs,
                requests,
                page: req.query.page
            });

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

    async approveIssue(req, res, next) {
        const { user_id, book_id } = req.query;

        try {
            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });   
            
            await Request.findOneAndDelete({ 'user_id.id': user._id, 'book_info.id': book._id });
            let bookIndex = -1;
            user.requestDetails.forEach((element, index) => {
                if (book._id.toString() == element._id.toString()){ 
                    bookIndex = index;                   
                }
            });
            user.requestDetails.splice(bookIndex, 1);
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

            await Promise.all([
                user.save(),
                book.save(),
                issue.save(),
                activity.save()
            ]); 

            res.redirect('/admin/profile?page=requests');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

    async rejectIssue(req, res, next) {
        const { user_id, book_id } = req.query;
        try {
            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });   
            
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

            res.redirect('/admin/profile?page=requests');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }
}

module.exports = new AdminController();
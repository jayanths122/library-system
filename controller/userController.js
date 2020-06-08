const User = require('../models/User'),
      Book = require('../models/Book'),
      Request = require('../models/Request'),
      Issue = require('../models/Issue'),
      Activity = require('../models/Activity'),
      { validTime } = require('../utilities/validTime');

class userController {
    constructor() {}

    /**
     * Renders the user profile.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async userProfile(req, res) {
        try {
            // Fetch user info, requests and issues he's made and all activities 
            const books = await Book.paginate({}, { page: 1, limit: 5 });
            const user = await User.findById({ _id: req.user._id });
            const requests = user.requestDetails;
            const issues = user.issueDetails;
            const activities = await Activity.find({ 'user_id.id': req.user._id });
            
            return res.render('user/profile', {
                userInfo: req.user,
                books: books.docs,
                requests: requests.length ? requests : [],
                issues: issues.length ? issues : [],
                activities: activities.length ? activities : [],
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
            res.redirect('/');
        }
    }


    /**
     * Updates the user profile.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async updateProfile(req, res, next) {
        try {
            // Find the user and update profile
            let user = await User.findById({ _id: req.user._id });
            const { first_name, last_name, phone, gender, email, address } = req.body;

            user.firstName = first_name;
            user.lastName = last_name;
            user.phone = phone;
            user.gender = gender;
            user.email = email;
            user.address = address;

            await user.save();
            
            res.redirect('/user/profile?page=home&scsMsg=Profile updated');
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }


    /**
     * Deletes all the activities for a user.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async deleteActivities(req, res, next) {
        try {
            // Find all the activities for the user and delete all
            await Activity.deleteMany({ 'user_id.id': req.user._id });
            res.redirect('/user/profile?page=activities&scsMsg=All activities deleted!');
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }


    /**
     * Makes request to issue a book.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async requestIssue(req, res, next) {
        
        const { book_id } = req.query;
        try {            
            const book = await Book.findById({ _id: book_id });
            const user = await User.findById({ _id: req.user._id });

            // Get the user's start date
            let date = new Date(user.started);
            date.setDate(date.getDate() + 15);
            const today = new Date();
            
            // Check if the user's membership has exceeded
            if (today.getTime() > date.getTime()) {
                return res.redirect('/user/profile?page=browse&errMsg=Sorry, your membership has expired.');
            }

            date = new Date(user.started);
            date.setDate(date.getDate() + 10);

            // Check if the user's membership is about to expire in 5 days
            if (today.getTime() > date.getTime()) {
                return res.redirect('/user/profile?page=browse&errMsg=Sorry, your membership is about to expire in 5 days.');
            }

            // Only allow requests between 9 and 5 PM
            if (!validTime()) {
                return res.redirect('/user/profile?page=browse&errMsg=Requests can only be made between 9 AM and 5 PM.');
            }

            if (book && user) {
                const { _id, title, author, bookId, stock } = book; 
                // Create a request for issue od book
                const request = new Request({
                    book_info : {
                        id : _id,
                        title,
                        author,
                        bookId,
                        stock,
                        requestStatus: 'pending'
                    }, 
                    
                    user_id : {
                        id : user._id,
                        username : `${user.firstName} ${user.lastName}`,
                    }
                });

                user.requestDetails.push(book._id);

                // Log the activity
                const activity = new Activity({
                    info: {
                        id: book._id,
                        title: book.title,
                    },
                    category: "Request",
                    request_time: {
                        id: request._id,
                        requestDate: request.book_info.requestDate
                    },
                    user_id: {
                        id: user._id,
                        username: `${user.firstName} ${user.lastName}`,
                    }
                });

                await Promise.all([
                    user.save(),
                    request.save(),
                    activity.save()
                ]);

                return res.redirect('/user/profile?page=browse&scsMsg=Issue request made successfully');
            }
            res.redirect('back');
        } catch (err) {
            console.log(err);
            res.redirect('back');
        }
    }


    /**
     * Makes request to return a book.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async returnBook(req, res, next) {
        const { user_id, book_id } = req.query;
        try {

            // Only allow return requests only between 9 and 5 PM
            if (!validTime()) {
                return res.redirect('/user/profile?page=browse&errMsg=Requests can only be made between 9 AM and 5 PM');
            }

            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });   
        
            // Once book is returned, delete the issue and update the stock
            await Issue.findOneAndDelete({ 'user_id.id': user._id, 'book_info.id': book._id });
            let bookIndex = -1;
            user.issueDetails.forEach((element, index) => {
                if (book._id.toString() == element._id.toString()){ 
                    bookIndex = index;                   
                }
            });
            user.issueDetails.splice(bookIndex, 1);
            book.stock += 1;

            await Promise.all([
                user.save(),
                book.save()
            ]); 

            return res.redirect('/user/profile?page=browse&scsMsg=Book has been successfully returned');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

}

module.exports = new userController();
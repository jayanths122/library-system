const User = require('../models/User'),
      Book = require('../models/Book'),
      Request = require('../models/Request'),
      Issue = require('../models/Issue'),
      Activity = require('../models/Activity');

class userController {
    constructor() {}

    validTime() {
        var startTime = '10:00:00';
        var endTime = '17:00:00';
        
        currentDate = new Date()   
        
        startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);
        
        endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);
        
        return startDate < currentDate && endDate > currentDate;
    }

    hasMembershipExpired(membershipDate) {
        const date = new Date(membershipDate);
        date.setDate(date.getDate() + 15);
        const today = new Date();

        return (date.getTime() > today.getTime());
    }

    async userProfile(req, res) {
        try {
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
                page: req.query.page
            });

        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }

    async updateProfile(req, res, next) {
        try {
            let user = await User.findById({ _id: req.user._id });
            const { first_name, last_name, phone, gender, email, address } = req.body;

            user.firstName = first_name;
            user.lastName = last_name;
            user.phone = phone;
            user.gender = gender;
            user.email = email;
            user.address = address;

            await user.save();
            
            res.redirect('/user/profile?page=home');
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

    async deleteActivities(req, res, next) {
        try {
            await Activity.deleteMany({ 'user_id.id': req.user._id });
            res.redirect('/user/profile?page=activities');
        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

    async requestIssue(req, res, next) {
        const { book_id } = req.query;
        try {            
            const book = await Book.findById({ _id: book_id });
            const user = await User.findById({ _id: req.user._id });

            if (this.hasMembershipExpired(book.started)) {
                return res.redirect('/user/profile?page=browse');
            }

            if (!this.validTime()) {
                return res.redirect('/user/profile?page=browse');
            }

            if (book && user) {
                const { _id, title, author, bookId, stock } = book; 
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

                return res.redirect('/user/profile?page=browse');
            }
            res.redirect('back');
        } catch (err) {
            console.log(err);
            res.redirect('back');
        }
    }

    async returnBook(req, res, next) {
        const { user_id, book_id } = req.query;
        try {

            if (!this.validTime()) {
                return res.redirect('/user/profile?page=browse');
            }

            const user = await User.findById({ _id: user_id });
            const book = await Book.findById({ _id: book_id });   
        
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

            return res.redirect('/user/profile?page=browse');

        } catch (error) {
            console.log(error);
            res.redirect('back');
        }
    }

}

module.exports = new userController();
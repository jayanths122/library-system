class Authenticate {
    constructor() {}

    // Middleware to check if the user is logged in 
    isLoggedIn(req, res, next) {
        
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to login first");
        res.redirect('/');
    }

    // Middleware to check if the user is logged in and is an admin
    isAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin) {
            return next();
        }
        req.flash("error", "Unauthorized access!");
        res.redirect('/');
    }

    // Middleware to check if admin logs in as user
    isNotAdmin(req, res, next) {
        if (req.isAuthenticated() && !(req.user.isAdmin)) {
            return next();
        }
        req.flash("error", "Unauthorized access!");
        res.redirect('/');
    }
}

module.exports = new Authenticate();
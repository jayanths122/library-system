class Authenticate {
    constructor() {}

    isLoggedIn(req, res, next) {
        
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be login first");
        res.redirect('/');
    }

    isAdmin(req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin) {
            return next();
        }
        req.flash("error", "Unauthorized access!");
        res.redirect('/');
    }
}

module.exports = new Authenticate();
const passport = require("passport"),
    User = require("../models/User");

class UserController {
    constructor() {}

    /**
     * Render homepage/landing page of the application.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    home(req, res) {
        res.render('homepage', { user : req.user });
    }


    /**
     * Render the registration page.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    register(req, res) {
        res.render('user/register', { errorMsg: "" });
    }


    /**
     * Register the user details.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    async doRegister(req, res) {

        const user = await User.find({ username: req.body.username }); 

        if (user.length) {
            return res.render('user/register', { user : user, errorMsg: "Username already exists. Try another one" });
        }

        User.register(new User({ 
            username : req.body.username, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            gender: req.body.gender
        }), 
            req.body.password, function(err, user) {
            if (err) {
                return res.render('user/register', { user : user });
            }
        
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    }


    /**
     * Render the user login page.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    login(req, res) {
        res.render('user/login');
    }


    /**
     * Render the admin login page.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    adminLogin(req, res) {
        res.render('admin/login');
    }


    /**
     *Login-in the user.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    doLogin(req, res) {
        /* Authenticate the user with passport.js' local strategy 
         * and specify the redirect routes on successful/failed log-in  
        */
        passport.authenticate('local', { 
            failureRedirect: '/'
          })(req, res, async function () {
            if (!req.user.isAdmin) {
                return res.redirect('/user/profile?page=home');
            }
            res.redirect('/')
        });
    }


    /**
     * Log-in the admin.
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    doLoginAdmin(req, res) {
        /* Authenticate the admin with passport.js' local strategy 
         * and specify the redirect routes on successful/failed log-in  
        */
        passport.authenticate('local', { 
            failureRedirect: '/'
          })(req, res, async function () {
            if (req.user.isAdmin) {
                return res.redirect('/admin/profile?page=home');
            }
            res.redirect('/');
        });
    }


    /**
     * Log-out action
     *
     * @param {number} req Request object.
     * @param {number} res Response object.
     * @return {void} 
    */
    logout(req, res) {
        req.logout();
        res.redirect('/');
    }
}

module.exports = new UserController();

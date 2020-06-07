const mongoose = require("mongoose"),
    passport = require("passport"),
    User = require("../models/User");

class UserController {
    constructor() {}

    home(req, res) {
        res.render('homepage', { user : req.user });
    }

    register(req, res) {
        res.render('user/register');
    }

    doRegister(req, res) {
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

    login(req, res) {
        res.render('user/login');
    }

    adminLogin(req, res) {
        res.render('admin/login');
    }

    doLogin(req, res) {
        passport.authenticate('local')(req, res, async function () {
            res.redirect('/user/profile?page=home');
        });
    }

    doLoginAdmin(req, res) {
        passport.authenticate('local')(req, res, async function () {
           if (req.user.isAdmin) {
                return res.redirect('/admin/profile?page=home');
           }
           res.redirect('/');
        });
    }

    logout(req, res) {
        req.logout();
        res.redirect('/');
    }
}

module.exports = new UserController();

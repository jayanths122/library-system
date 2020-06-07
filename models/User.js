var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    gender: String,
    image: {
        type: String,
        default: 'avatar.png'
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    started: {
        type: Date,
        default: Date.now()
    },
    membershipDays: {
        type: Number,
        default: 15
    },
    membershipHours: {
        type: Number,
        default: 24
    },
    phone: String,
    address: String,
    requestDetails: [{
        bookInfo: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Request',
            },
        },
    }],
    issueDetails: [{
        bookInfo: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Issue',
            },
        },
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

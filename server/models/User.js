var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,

    facebook: String,
    twitter: String,
    tumblr: String,
    reddit: String,
    imgur: String,
    google: String,
    github: String,
    instagram: String,
    steam: String,
    tokens: Array,

    profile: {
        name: { type: String, default: '' },
        gender: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        picture: { type: String, default: '' },
        redditUsername: { type: String, default: '' }
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailConfirmedDate: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

/**
 * Helper method for setting user's password
 */
userSchema.methods.updatePassword = function (currentPassword, newPassword, cb) {
    userSchema.methods.comparePassword(currentPassword, function (err, match) {
        if (err) {
            return cb(err);
        } else if (!match) {
            return cb(null, false);
        }
        this.password = newPassword;
        cb(null, true);
    });
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

/**
 * Helper method for getting specifit access token
 */
userSchema.methods.getAccessToken = function (kind) {
    return _.find(this.tokens, { kind: kind });
}

module.exports = mongoose.model('User', userSchema);
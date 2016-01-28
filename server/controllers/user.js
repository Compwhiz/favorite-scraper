var User = require('../models/User');
var _ = require('lodash');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_PRIVATE_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

exports.all = function (req, res, next) {
    return User.find({}, function (err, users) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(users);
    });
};

exports.postLogin = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send(info.message);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    })(req, res, next);
};

exports.createUser = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(_.pluck(errors, 'msg'));
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (existingUser) {
            return res.status(400).send('Account with that email address already exists.');//redirect('/signup');
        }
        user.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.status(500).send(err);// next(err);
                }
                res.send(user);
            });
        });
    });
}

exports.updateProfile = function (req, res, next) {
    if (req.body.id) {
        return User.findById(req.body.id, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(404).send();
            }
            _.extend(user, req.body.user);
            return user.save(function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(user);
            });
        });
    }
    return res.status(400).send('No user id specified');
};

exports.setPassword = function (req, res, next) {
    if (req.user) {
        if (req.body.currentPassword && req.body.newPassword) {
            return User.findById(req.user._id, function (err, user) {
                if (err) {
                    return res.status(500).send(err);
                }
                else if (!user) {
                    return res.status(404).send('User not found');
                }

                user.comparePassword(req.body.currentPassword, function (err, match) {
                    if (err) {
                        return res.status(500).send(err);
                    } else if (!match) {
                        return res.status(400).send('Incorrect password');
                    }
                    user.password = req.body.newPassword;
                    user.save(function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.send(user);
                    });
                });
            });
        }
        else if (req.body.password) {
            return User.findById(req.user._id, function (err, user) {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!user) {
                    return res.status(404).send('User not found');
                }

                user.password = req.body.password;
                user.save(function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.send(user);
                });

            });
        }
    }
    return res.status(400).send();
}

exports.resetPassword = function (req, res, next) {
    req.assert('token').notEmpty();
    req.assert('password').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(_.pluck(errors, 'msg'));
    }

    User.findOne({ resetPasswordToken: req.body.token }, function (err, user) {
        if (err) {
            return res.status(500).send(err);
        }
        else if (!user) {
            return res.status(404).send();
        }
        else if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).send('Token expired');
        }

        user.password = req.body.password;

        user.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                res.send(user);
            });
        });
    });
}

exports.delete = function (req, res, next) {
    if (req.body.id) {
        return User.findByIdAndRemove(req.body.id, function (err, doc) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(doc);
        });
        // console.log('Delete user ' + req.body.id);
    }
    return res.status(400).send('No user specified')
};

exports.unlinkAccount = function (req, res, next) {
    if (req.body.id && req.body.type) {
        return User.findById(req.body.id, function (err, user) {
            if (user[req.body.type]) {
                user[req.body.type] = null;
                user.markModified(req.body.type);
            }

            _.remove(user.tokens, { kind: req.body.type });

            user.markModified('tokens');

            user.save(function (err, user, numAffected) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(user);
            });
        });
        // console.log('remove ' + req.body.type + ' token.');
    }
    return res.status(400).send('No user/token type specified');
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function (req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(_.pluck(errors, 'message'));
    }

    async.waterfall([
        function (done) {
            crypto.randomBytes(16, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
                if (!user) {
                    return res.send(true);
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var mailOptions = {
                to: user.email,
                from: 'help@favscraper.com',
                subject: 'Reset your FavScraper password',
                html: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#/reset?token=' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            mailgun.messages().send(mailOptions, function (err, body) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.send(body);
            });
        }
    ], function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/forgot');
    });
};

exports.validateResetToken = function (req, res, next) {
    req.assert('token').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(_.pluck(errors, 'message'));
    }

    User.findOne({ resetPasswordToken: req.body.token }, function (err, user) {
        if (err) {
            return res.status(500).send(err);
        }
        else if (!user) {
            return res.status(404).send();
        }
        else if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).send('Token expired');
        }
        res.send(req.body.token);
    });
};
var _ = require('lodash');
var passport = require('passport');
var request = require('request');
// var InstagramStrategy = require('passport-instagram').Strategy;
// var GitHubStrategy = require('passport-github').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
// var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// var OpenIDStrategy = require('passport-openid').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var RedditStrategy = require('passport-reddit').Strategy;
var ImgurStrategy = require('passport-imgur').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TumblrStrategy = require('passport-tumblr').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var User = require('../models/User');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/**
 * Sign in with Instagram.
 */
// passport.use(new InstagramStrategy({
//   clientID: process.env.INSTAGRAM_ID,
//   clientSecret: process.env.INSTAGRAM_SECRET,
//   callbackURL: '/auth/instagram/callback',
//   passReqToCallback: true
// },function(req, accessToken, refreshToken, profile, done) {
//   if (req.user) {
//     User.findOne({ instagram: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already an Instagram account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, function(err, user) {
//           user.instagram = profile.id;
//           user.tokens.push({ kind: 'instagram', accessToken: accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.picture = user.profile.picture || profile._json.data.profile_picture;
//           user.profile.website = user.profile.website || profile._json.data.website;
//           user.save(function(err) {
//             req.flash('info', { msg: 'Instagram account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ instagram: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       var user = new User();
//       user.instagram = profile.id;
//       user.tokens.push({ kind: 'instagram', accessToken: accessToken });
//       user.profile.name = profile.displayName;
//       // Similar to Twitter API, assigns a temporary e-mail address
//       // to get on with the registration process. It can be changed later
//       // to a valid e-mail address in Profile Management.
//       user.email = profile.username + "@instagram.com";
//       user.profile.website = profile._json.data.website;
//       user.profile.picture = profile._json.data.profile_picture;
//       user.save(function(err) {
//         done(err, user);
//       });
//     });
//   }
// }));

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
    email = email.toLowerCase();
    User.findOne({ email: email }, function (err, user) {
        if (!user) {
            return done(null, false, { message: 'Email ' + email + ' not found' });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid email or password.' });
            }
        });
    });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_ID,
//   clientSecret: process.env.FACEBOOK_SECRET,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
//   passReqToCallback: true
// }, function(req, accessToken, refreshToken, profile, done) {
//   if (req.user) {
//     User.findOne({ facebook: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, function(err, user) {
//           user.facebook = profile.id;
//           user.tokens.push({ kind: 'facebook', accessToken: accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.gender = user.profile.gender || profile._json.gender;
//           user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
//           user.save(function(err) {
//             req.flash('info', { msg: 'Facebook account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ facebook: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
//           done(err);
//         } else {
//           var user = new User();
//           user.email = profile._json.email;
//           user.facebook = profile.id;
//           user.tokens.push({ kind: 'facebook', accessToken: accessToken });
//           user.profile.name = profile.displayName;
//           user.profile.gender = profile._json.gender;
//           user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
//           user.profile.location = (profile._json.location) ? profile._json.location.name : '';
//           user.save(function(err) {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));

/**
 * Sign in with GitHub.
 */
// passport.use(new GitHubStrategy({
//   clientID: process.env.GITHUB_ID,
//   clientSecret: process.env.GITHUB_SECRET,
//   callbackURL: '/auth/github/callback',
//   passReqToCallback: true
// }, function(req, accessToken, refreshToken, profile, done) {
//   if (req.user) {
//     User.findOne({ github: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, function(err, user) {
//           user.github = profile.id;
//           user.tokens.push({ kind: 'github', accessToken: accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.picture = user.profile.picture || profile._json.avatar_url;
//           user.profile.location = user.profile.location || profile._json.location;
//           user.profile.website = user.profile.website || profile._json.blog;
//           user.save(function(err) {
//             req.flash('info', { msg: 'GitHub account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ github: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
//           done(err);
//         } else {
//           var user = new User();
//           user.email = profile._json.email;
//           user.github = profile.id;
//           user.tokens.push({ kind: 'github', accessToken: accessToken });
//           user.profile.name = profile.displayName;
//           user.profile.picture = profile._json.avatar_url;
//           user.profile.location = profile._json.location;
//           user.profile.website = profile._json.blog;
//           user.save(function(err) {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));

// Sign in with Twitter.

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: '/login/twitter/callback',
    passReqToCallback: true
}, function (req, accessToken, tokenSecret, profile, done) {
    if (req.user) {
        User.findOne({ twitter: profile.id }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.twitter = profile.id;
                    user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.location = user.profile.location || profile._json.location;
                    user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
                    user.save(function (err) {
                        req.flash('info', { msg: 'Twitter account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ twitter: profile.id }, function (err, existingUser) {
            if (existingUser) {
                return done(null, existingUser);
            }
            var user = new User();
            // Twitter will not provide an email address.  Period.
            // But a person’s twitter username is guaranteed to be unique
            // so we can "fake" a twitter email address as follows:
            user.email = profile.username + "@twitter.com";
            user.twitter = profile.id;
            user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
            user.profile.name = profile.displayName;
            user.profile.location = profile._json.location;
            user.profile.picture = profile._json.profile_image_url_https;
            user.save(function (err) {
                done(err, user);
            });
        });
    }
}));


// Sign in with Reddit.

passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_KEY,
    clientSecret: process.env.REDDIT_SECRET,
    callbackURL: '/login/reddit/callback',
    passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
    var oneHour = Date.now() + (60 * 60 * 1000);
    if (req.user) {
        User.findOne({ reddit: profile.id }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', { msg: 'There is already a Reddit account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.reddit = profile.id;
                    user.tokens.push({ kind: 'reddit', accessToken: accessToken, refreshToken: refreshToken, expires: oneHour });
                    user.profile.name = user.profile.name || profile.name;
                    user.profile.redditUsername = profile.name;
                    user.save(function (err) {
                        req.flash('info', { msg: 'Reddit account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ reddit: profile.id }, function (err, existingUser) {
            if (existingUser) {
                User.findById(existingUser.id, function (err, user) {
                    var redditTokenIndex = _.findIndex(user.tokens, { kind: 'reddit' });
                    if (redditTokenIndex >= 0) {
                        // Update access and refresh tokens
                        user.tokens[redditTokenIndex].accessToken = accessToken;
                        user.tokens[redditTokenIndex].refreshToken = refreshToken;
                        user.tokens[redditTokenIndex].expires = oneHour;
                    } else {
                        user.tokens.push({ kind: 'reddit', accessToken: accessToken, refreshToken: refreshToken, expires: oneHour });
                    }
                    user.markModified('tokens');

                    user.save(function (err) {
                        return done(err, user);
                    });
                });
                // return done(null, existingUser);
            } else {
                var user = new User();
                // user.email = profile.username + "@reddit.com";
                user.reddit = profile.id;
                user.tokens.push({ kind: 'reddit', accessToken: accessToken, refreshToken: refreshToken, expires: oneHour });
                user.profile.name = profile.name;
                user.profile.redditUsername = profile.name;
                user.save(function (err) {
                    done(err, user);
                });
            }
        });
    }
}));

// Sign in with Imgur
passport.use(new ImgurStrategy({
    clientID: process.env.IMGUR_KEY,
    clientSecret: process.env.IMGUR_SECRET,
    callbackURL: 'http://localhost:3000/login/imgur/callback',
    passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({ imgur: profile.id }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', { msg: 'There is already a Imgur account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.imgur = profile.id;
                    user.tokens.push({ kind: 'imgur', accessToken: accessToken, refreshToken: refreshToken });
                    user.profile.name = user.profile.name || profile.name;
                    user.save(function (err) {
                        req.flash('info', { msg: 'Imgur account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ imgur: profile.id }, function (err, existingUser) {
            if (existingUser) {
                User.findById(existingUser.id, function (err, user) {
                    var imgurTokenIndex = _.findIndex(user.tokens, { kind: 'imgur' });
                    if (imgurTokenIndex >= 0) {
                        // Update access and refresh tokens
                        user.tokens[imgurTokenIndex].accessToken = accessToken;
                        user.tokens[imgurTokenIndex].refreshToken = refreshToken;
                    } else {
                        user.tokens.push({ kind: 'imgur', accessToken: accessToken, refreshToken: refreshToken });
                    }
                    user.markModified('tokens');

                    user.save(function (err) {
                        return done(err, user);
                    });
                });
                // return done(null, existingUser);
            } else {
                var user = new User();
                // user.email = profile.username + "@imgur.com";
                user.imgur = profile.id;
                user.tokens.push({ kind: 'imgur', accessToken: accessToken, refreshToken: refreshToken });
                user.profile.name = profile.name;
                user.save(function (err) {
                    done(err, user);
                });
            }
        });
    }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
        User.findOne({ google: profile.id }, function (err, existingUser) {
            if (existingUser) {
                req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                done(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    user.google = profile.id;
                    user.tokens.push({ kind: 'google', accessToken: accessToken });
                    user.profile.name = user.profile.name || profile.displayName;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || profile._json.image.url;
                    user.save(function (err) {
                        req.flash('info', { msg: 'Google account has been linked.' });
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ google: profile.id }, function (err, existingUser) {
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({ email: profile.emails[0].value }, function (err, existingEmailUser) {
                if (existingEmailUser) {
                    req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
                    done(err);
                } else {
                    var user = new User();
                    user.email = profile.emails[0].value;
                    user.google = profile.id;
                    user.tokens.push({ kind: 'google', accessToken: accessToken });
                    user.profile.name = profile.displayName;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = profile._json.image.url;
                    user.save(function (err) {
                        done(err, user);
                    });
                }
            });
        });
    }
}));

/**
 * Sign in with LinkedIn.
 */
// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_ID,
//   clientSecret: process.env.LINKEDIN_SECRET,
//   callbackURL: process.env.LINKEDIN_CALLBACK_URL,
//   scope: ['r_basicprofile', 'r_emailaddress'],
//   passReqToCallback: true
// }, function(req, accessToken, refreshToken, profile, done) {
//   if (req.user) {
//     User.findOne({ linkedin: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, function(err, user) {
//           user.linkedin = profile.id;
//           user.tokens.push({ kind: 'linkedin', accessToken: accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.location = user.profile.location || profile._json.location.name;
//           user.profile.picture = user.profile.picture || profile._json.pictureUrl;
//           user.profile.website = user.profile.website || profile._json.publicProfileUrl;
//           user.save(function(err) {
//             req.flash('info', { msg: 'LinkedIn account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ linkedin: profile.id }, function(err, existingUser) {
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//       User.findOne({ email: profile._json.emailAddress }, function(err, existingEmailUser) {
//         if (existingEmailUser) {
//           req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
//           done(err);
//         } else {
//           var user = new User();
//           user.linkedin = profile.id;
//           user.tokens.push({ kind: 'linkedin', accessToken: accessToken });
//           user.email = profile._json.emailAddress;
//           user.profile.name = profile.displayName;
//           user.profile.location = profile._json.location.name;
//           user.profile.picture = profile._json.pictureUrl;
//           user.profile.website = profile._json.publicProfileUrl;
//           user.save(function(err) {
//             done(err, user);
//           });
//         }
//       });
//     });
//   }
// }));

/**
 * Tumblr API OAuth.
 */
passport.use('tumblr', new TumblrStrategy({
    consumerKey: process.env.TUMBLR_KEY,
    consumerSecret: process.env.TUMBLR_SECRET,
    callbackURL: '/login/tumblr/callback',
    passReqToCallback: true
},
    function (req, accessToken, refreshToken, profile, done) {
        profile = profile._json.response.user;

        if (req.user) {
            User.findOne({ tumblr: profile.name }, function (err, existingUser) {
                if (existingUser) {
                    req.flash('errors', { msg: 'There is already a Tumblr account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, function (err, user) {
                        user.tumblr = profile.name;
                        user.tokens.push({ kind: 'tumblr', accessToken: accessToken });
                        user.profile.name = user.profile.name || profile.name;
                        user.save(function (err) {
                            req.flash('info', { msg: 'Tumblr account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ tumblr: profile.name }, function (err, existingUser) {
                if (existingUser) {
                    User.findById(existingUser.id, function (err, user) {
                        var tumblrTokenIndex = _.findIndex(user.tokens, { kind: 'tumblr' });
                        if (tumblrTokenIndex >= 0) {
                            // Update access and refresh tokens
                            user.tokens[tumblrTokenIndex].accessToken = accessToken;
                            user.tokens[tumblrTokenIndex].refreshToken = refreshToken;
                        } else {
                            user.tokens.push({ kind: 'tumblr', accessToken: accessToken, refreshToken: refreshToken });
                        }
                        user.markModified('tokens');

                        user.save(function (err) {
                            return done(err, user);
                        });
                    });
                    // return done(null, existingUser);
                } else {
                    var user = new User();
                    // user.email = profile.username + "@imgur.com";
                    user.tumblr = profile.name;
                    user.tokens.push({ kind: 'tumblr', accessToken: accessToken, refreshToken: refreshToken });
                    user.profile.name = profile.name;
                    user.save(function (err) {
                        done(err, user);
                    });
                }
            });
        }
    }
    ));

/**
 * Steam API OpenID.
 */
// passport.use(new OpenIDStrategy({
//   apiKey: process.env.STEAM_KEY,
//   providerURL: 'http://steamcommunity.com/openid',
//   returnURL: 'http://localhost:3000/auth/steam/callback',
//   realm: 'http://localhost:3000/',
//   stateless: true
// }, function(identifier, done) {
//   var steamId = identifier.match(/\d+$/)[0];
//   var profileURL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + process.env.STEAM_KEY + '&steamids=' + steamId;

//   User.findOne({ steam: steamId }, function(err, existingUser) {
//     if (existingUser) return done(err, existingUser);
//     request(profileURL, function(error, response, body) {
//       if (!error && response.statusCode == 200) {
//         var data = JSON.parse(body);
//         var profile = data.response.players[0];

//         var user = new User();
//         user.steam = steamId;
//         user.email = steamId + '@steam.com'; // steam does not disclose emails, prevent duplicate keys
//         user.tokens.push({ kind: 'steam', accessToken: steamId });
//         user.profile.name = profile.personaname;
//         user.profile.picture = profile.avatarmedium;
//         user.save(function(err) {
//           done(err, user);
//         });
//       } else {
//         done(error, null);
//       }
//     });
//   });
// }));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send("User not logged in.");
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function (req, res, next) {
    // different api endpoints
    var provider = req.path.split('/').slice(2)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.status(403).send(provider);//redirect('/auth/' + provider);
    }
};
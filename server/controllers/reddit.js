var request = require('request');
var _ = require('lodash');
// var when = require('when');

var Snoocore = require('snoocore')
var reddit = new Snoocore({
    // Unique string identifying the app
    userAgent: process.env.REDDIT_USER_AGENT,
    // It's possible to adjust throttle less than 1 request per second.
    // Snoocore will honor rate limits if reached.
    throttle: 300,
    oauth: {
        type: 'explicit',
        redirectUri: 'http://localhost:3000/#/reddit/auth/callback',
        duration: 'permanent',
        key: process.env.REDDIT_KEY,
        secret: process.env.REDDIT_SECRET,
        // The OAuth scopes that we need to make the calls that we
        // want. The reddit documentation will specify which scope
        // is needed for evey call
        scope: ['identity', 'read', 'history']
    }
});

function setAccessToken(user) {
    var redditToken = _.find(user.tokens, { kind: 'reddit' });
            reddit.setRefreshToken(redditToken.refreshToken);
            reddit.setAccessToken(redditToken.accessToken);

    // if (redditToken) {
    //     if (redditToken.expires < Date.now()) {
    //         // need to refresh token
    //         reddit.setRefreshToken(redditToken.refreshToken);
    //     } else {
    //         reddit.setAccessToken(redditToken.accessToken);
    //         return when.resolve();
    //     }
    // }
}

exports.getSavedPosts = function (req, res, next) {
    setAccessToken(req.user);

    var options = {};

    if (req.query.after) {
        options.after = req.query.after;
    }

    reddit('/u/' + req.user.profile.redditUsername + '/saved').get(options).then(function (result) {
        if (result.status) {

        }
        res.send(result);
    }).catch(function (error) {
        res.status(500).send(error);
    });
};

exports.getCurrentUser = function (req, res, next) {
    // if (getRedditInstance(req)) {
    //     return reddit('/api/v1/me').get().then(function (result) {
    //         return res.send(result);
    //     }).catch(function (error) {
    //         return res.status(500).send(error);
    //     });
    // }
    return res.status(400).send('No reddit user found');
};
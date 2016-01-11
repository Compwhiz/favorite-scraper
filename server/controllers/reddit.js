var Snoocore;
var reddit = null;

function getRedditInstance(req) {
  if (req.user.profile.redditUsername) {
    Snoocore = require('snoocore');

    reddit = new Snoocore({
      // Unique string identifying the app
      userAgent: process.env.REDDIT_USER_AGENT,
      // useBrowserCookies: true,
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
  } else {
    reddit = null;
  }

  return reddit;
}

exports.getSavedPosts = function (req, res, next) {
  if (getRedditInstance(req)) {
    return reddit('/u/' + req.user.profile.redditUsername + '/saved').get().then(function (result) {
      return res.send(result);
    }).catch(function (error) {
      return res.status(500).send(error);
    });
  }
  return res.status(400).send('No reddit user found');
};

exports.getCurrentUser = function (req, res, next) {
  if (getRedditInstance(req)) {
    return reddit('/api/v1/me').get().then(function (result) {
      return res.send(result);
    }).catch(function (error) {
      return res.status(500).send(error);
    });
  }
  return res.status(400).send('No reddit user found');
};
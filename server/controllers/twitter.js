var Twit;
var _;

/**
 * GET /api/twitter
 * Twiter API example.
 */
exports.getFavorites = function (req, res, next) {
  Twit = require('twit');
  _ = require('lodash');

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  return T.get('favorites/list', function (err, list) {
    if (err) {
      return next(err);
    }
    return res.send(list);
  });
};

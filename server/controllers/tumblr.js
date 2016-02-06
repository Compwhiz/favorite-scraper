var tumblr = require('tumblr');

exports.getUsersLikes = function (req, res, next) {
    if (req.user) {
        var tumblrAccessToken = req.user.getAccessToken('tumblr');
        if (tumblrAccessToken) {
            var user = new tumblr.User({
                consumer_key: process.env.TUMBLR_KEY,
                consumer_secret: process.env.TUMBLR_SECRET,
                token: tumblrAccessToken.accessToken,
                token_secret: tumblrAccessToken.tokenSecret
            });

            user.likes(function (err, response) {
                if (err) {
                    return res.status(500).send(err);
                }
                res.send(response);
            });
        }
    }
}
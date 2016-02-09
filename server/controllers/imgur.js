var _ = require('lodash');
var request = require('request');
var apiBase = 'https://api.imgur.com/3/';
var oauthURL = 'https://api.imgur.com/oauth2/token';

function getRequestOptions(req, url, useAccessToken) {
    var options = {};

    useAccessToken = useAccessToken || true;

    options.url = apiBase + url;

    options.headers = {
        'Authorization': 'Client-ID' + process.env.IMGUR_KEY
    };

    if (req.user && useAccessToken) {
        var imgurToken = req.user.getAccessToken('imgur');
        if (imgurToken && imgurToken.accessToken) {
            options.headers.Authorization = 'Bearer ' + imgurToken.accessToken;
        }
    }

    return options;
}

/**
 * GET: getAccount
 */
exports.getAccount = function (req, res, next) {
    var options = getRequestOptions(req, 'account/me');
    return request(options, function (err, req, body) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(body);
    });
};

/**
 * GET: getFavorites
 */
exports.getFavorites = function (req, res, next) {
    var options = getRequestOptions(req, 'account/me/favorites');
    return request(options, function (err, req, body) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(body);
    });
};

/**
 * GET: getAlbumInfo
 */
exports.getAlbumInfo = function (req, res, next) {
    var albumId = null;
    if (req.params && req.params.id) {
        albumId = req.params.id;
    }

    if (!albumId) {
        return res.status(500).send('Invalid album id');
    }

    var options = getRequestOptions(req, 'album/' + albumId);
    return request(options, function (err, req, body) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(body);
    })
};

/**
 * GET: getAlbumImages
 */
exports.getAlbumImages = function (req, res, next) {
    var albumId = null;
    if (req.params && req.params.id) {
        albumId = req.params.id;
    }

    if (!albumId) {
        return res.status(500).send('Invalid album id');
    }

    var options = getRequestOptions(req, 'album/' + albumId + '/images');
    return request(options, function (err, req, body) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(body);
    })
};

//https://api.imgur.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=REQUESTED_RESPONSE_TYPE&state=APPLICATION_STATE
exports.refresh = function (req, res, next) {
    var imgurToken = req.user.getAccessToken('imgur');
    var url = oauthURL;// + '?refresh_token=' + imgurToken.refreshToken + '&client_id=' + process.env.IMGUR_KEY + '&client_secret=' + process.env.IMGUR_SECRET + '&grant_type=refresh_token';
    var data = {
        "refresh_token": imgurToken.refreshToken,
        "client_id": process.env.IMGUR_KEY,
        "client_secret": process.env.IMGUR_SECRET,
        "grant_type": "refresh_token"
    };
    return request.post(url, data, function (err, req, body) {
        if (err) {
            return next(err);
        }
        console.log(body);
        return next(null, JSON.parse(body));
    });
};
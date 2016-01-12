var _ = require('lodash');
var request = require('request');
var apiBase = 'https://api.imgur.com/3/';
var oauthURL = 'https://api.imgur.com/oauth2/token';

function getRequestOptions(req, url) {
	var options = {};

	options.url = apiBase + url;

	options.headers = {
		'Authorization': 'Client-ID' + process.env.IMGUR_KEY
	};

	if (req.user) {
		var imgurToken = _.find(req.user.tokens, { kind: 'imgur' });
		if (imgurToken && imgurToken.accessToken) {
			options.headers.Authorization = 'Bearer ' + imgurToken.accessToken;
		}
	}

	return options;
}

exports.getAccount = function (req, res, next) {
	var options = getRequestOptions(req, 'account/me');
	return request(options, function (err, req, body) {
		if (err) {
			return res.status(500).send(err);
		}
		return res.send(body);
	});
};

exports.getFavorites = function (req, res, next) {
	var options = getRequestOptions(req, 'account/me/favorites');
	return request(options, function (err, req, body) {
		if (err) {
			return res.status(500).send(err);
		}
		return res.send(body);
	});
};

//https://api.imgur.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=REQUESTED_RESPONSE_TYPE&state=APPLICATION_STATE
exports.refresh = function (req, res, next) {
	var imgurToken = _.find(req.user.tokens, { kind: 'imgur' });
	var url = oauthURL;// + '?refresh_token=' + imgurToken.refreshToken + '&client_id=' + process.env.IMGUR_KEY + '&client_secret=' + process.env.IMGUR_SECRET + '&grant_type=refresh_token';
	var data = {
		"refresh_token": imgurToken.refreshToken,
		"client_id": process.env.IMGUR_KEY,
		"client_secret": process.env.IMGUR_SECRET,
		"grant_type": "refresh_token"
	};
	return request.post(url, data, function (err, req, body) {
		if (err) {
			return res.status(500).send(err);
		}
		console.log(body);
		return res.send(JSON.parse(body));
	});
};
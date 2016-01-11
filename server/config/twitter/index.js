(function () {
	var TwitterAPI = require('node-twitter-api');
	var secrets = require('../secrets');

	var twitter = new TwitterAPI(secrets.twitter);

	module.exports = twitter;
} ());
(function () {
	var medium = require('medium-sdk');
	var secrets = require('../secrets');

	var client = new medium.MediumClient(secrets.medium);

	module.exports = { medium: medium, client: client };
})();
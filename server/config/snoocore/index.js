(function () {
  var Snoocore = require('snoocore');
  var secrets = require('../secrets');
  /*
     Our new instance associated with a single account.
     It can take in various configuration options.
   */
  var reddit = new Snoocore(secrets.reddit);

  module.exports = reddit;

} ());
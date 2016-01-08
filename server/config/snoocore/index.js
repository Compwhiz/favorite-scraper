(function(){
	var Snoocore = require('snoocore');

/*
   Our new instance associated with a single account.
   It can take in various configuration options.
 */
var reddit = new Snoocore({
  // Unique string identifying the app
  userAgent: '/u/compwhiz favorite-scrapper@1.0.0',
  // It's possible to adjust throttle less than 1 request per second.
  // Snoocore will honor rate limits if reached.
  throttle: 300,
  oauth: {
    type: 'explicit',
    redirectUri: 'http://localhost:3000/#/reddit/auth/callback',
    key: 'RKrJ1Q9gB65l6Q',
    secret:'1SpgY9F1qldnsp8fbUe-6bRyYSs',
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'history' ]
  }
});
	
  module.exports = reddit;
  
} ());
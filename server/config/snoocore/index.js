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
    redirectUri: 'http://localhost:3000/api/reddit/auth/callback',
    key: 'RKrJ1Q9gB65l6Q',
    secret:'1SpgY9F1qldnsp8fbUe-6bRyYSs',
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'history' ]
  }
});



/*
   Prints a slice's children to stdout.
 */
function printSlice(slice) {
  console.log('>>> Children in this slice', slice.children.length);
  slice.children.forEach(function(child) {
    console.log('[score: ' + child.data.score + '] ' + child.data.title);
  });
}

// get information about a user
// reddit('/api/v1/me').get().then(function(result) {

//   console.log('==== Reddit result ====', result); // information about a user account

//   // Use the listing helper to gracefully handle listings
//   // Returns a promise for a slice -- a piece of a listing.
//   // return reddit('/r/thomasthedankengine/hot').listing({ limit: 5 });
// })
// // .then(function(slice) {
// //   printSlice(slice);   // First page children
// //   return slice.next(); // A promise for the next slice in the listing
// // }).then(function(slice) {
// //   printSlice(slice);   // Second page children
// //   console.log('done!');
// // })
// .catch(function(error) {
//   console.log();
//   console.error('oh no!', error);
// });

/*** ***/

// var AUTHORIZATION_CODE = '??'; /* url parameter "code", see above */
// var RETURNED_STATE = '??'; /* url parameter "state", see above */

// // Exit if the state given is invalid. This is an optional
// // check, but is recommended if you set a state in 
// // `reddit.getExplicitAuthUrl`
// if (RETURNED_STATE !== state) {
//   console.error('State is not the same as the one set!');
//   process.exit(1);                                  
// }

// // Authenticate with reddit by passing in the authorization code from the response
// reddit.auth(AUTHORIZATION_CODE).then(function(refreshToken) {
//   // The refreshToken will be defined if in the initial
//   // config `duration: 'permanent'`
//   // Otherwise if using a 'temporary' duration it can be ignored.
  
//   // Make an OAuth call to show that it is working
//   return reddit('/api/v1/me').get();
// })
// .then(function(data) {
//   console.log(data); // Log the response
// });
	
  module.exports = reddit;
  
} ());
(function () {

  'use strict';

  module.exports = function (reddit) {
    var express = require('express');
    var router = express.Router();
    var user = null;

    var LOGIN_STATE = 'REDDITLOGIN';
    var LS_REDDIT_AUTH_CODE = 'REDDIT_AUTH_CODE';

    // var authCode = localStorage.getItem(LS_REDDIT_AUTH_CODE);
    // if (authCode)
    //   reddit.auth(authCode).then(function (refreshToken) {
    //     console.log('AUTHCODE ', authCode);
    //   }).catch(function (error) {
    //     console.error('ERROR: ', error);
    //   });

    /* GET home page. */
    router.get('/auth/callback', function (req, res) {
      var AUTHORIZATION_CODE = req.query.code; /* url parameter "code" */
      var RETURNED_STATE = req.query.state; /* url parameter "state"" */

      // Exit if the state given is invalid. This is an optional
      // check, but is recommended if you set a state in 
      // `reddit.getExplicitAuthUrl`
      if (RETURNED_STATE !== LOGIN_STATE) {
        console.error('State is not the same as the one set!');
        res.render('error');
      } else {
        
        // if (typeof localStorage !== 'undefined' && localStorage !== null) {
        //   localStorage.setItem(LS_REDDIT_AUTH_CODE, AUTHORIZATION_CODE);
        // }
        
        // Authenticate with reddit by passing in the authorization code from the response
        reddit.auth(AUTHORIZATION_CODE).then(function (refreshToken) {
          // The refreshToken will be defined if in the initial
          // config `duration: 'permanent'`
          // Otherwise if using a 'temporary' duration it can be ignored.
  
          // Make an OAuth call to show that it is working
          // return reddit('/api/v1/me').get();
         
          return res.render('index');
        });
      }
    });

    router.get('/auth-url', function (req, res) {
      var url = reddit.getAuthUrl(LOGIN_STATE);
      return res.send(url);

    });

    router.get('/me', function (req, res) {
      // Print out stats about the user, that's it.
      return reddit('/api/v1/me').get().then(function (result) {
        user = result;
        return res.send(JSON.stringify(result, null, 4));
      }).catch(function (error) {
        // throw error;
        return res.status(500).send(JSON.stringify(error, null, 4));
      });
    });

    router.get('/saved', function (req, res) {
      // Print out stats about the user, that's it.
      if (user !== null) {
        return reddit('/u/' + user.name + '/saved').get().then(function (result) {
          return res.send(JSON.stringify(result, null, 4));
        }).catch(function (error) {
          return res.status(500).send(JSON.stringify(error, null, 4));
        });
      } else {
        return reddit('/api/v1/me').get().then(function (result) {
          return reddit('/u/' + user.name + '/saved').get().then(function (result) {
            return res.send(JSON.stringify(result, null, 4));
          });
        }).catch(function (error) {
          // throw error;
          return res.status(500).send(JSON.stringify(error, null, 4));
        });
      }
    });

    return router;
  };
} ());

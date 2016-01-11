(function () {

  'use strict';

  module.exports = function (reddit, expressApp) {
    var express = require('express');
    var router = express.Router();
    var when = require('when');
    var user = null;

    var LOGIN_STATE = 'REDDITLOGIN';

    // reddit.on('access_token_refreshed', function (accessToken) {
    //   console.log('access_token_refreshed', accessToken);
    // });

    router.get('/auth-url', function (req, res) {
      var url = reddit.getAuthUrl(LOGIN_STATE);
      var response = { url: url };
      if (!reddit.hasRefreshToken() && req.session.redditRefreshToken) {
        reddit.refresh(req.session.redditRefreshToken);
      }
      return res.send(response);

    });

    router.post('/login', function (req, res) {
      var AUTHORIZATION_CODE = req.body.code; /* url parameter "code" */
      var RETURNED_STATE = req.body.state; /* url parameter "state"" */

      // Exit if the state given is invalid. This is an optional
      // check, but is recommended if you set a state in 
      // `reddit.getExplicitAuthUrl`
      if (RETURNED_STATE !== LOGIN_STATE) {
        console.error('State is not the same as the one set!');
        res.status(500).send('State is not the same as the one set!');
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
          
          req.session.redditRefreshToken = refreshToken;

          return res.send({ auth: true });
        }).catch(function (error) {
          return res.status(500).send(error);
        });
      }
    });

    router.get('/me', function (req, res) {
      return getCurrentUser().then(function (result) {
        user = result;
        return res.send(JSON.stringify(result, null, 4));
      }).catch(function (error) {
        // throw error;
        return res.status(500).send(JSON.stringify(error, null, 4));
      });
    });

    router.get('/saved', function (req, res) {
      return getSavedPosts().then(function (result) {
        return res.send(JSON.stringify(result, null, 4));
      }).catch(function (error) {
        return res.status(500).send(error);
      });
    });

    function getCurrentUser() {
      if (user !== null) {
        return when(user);
      }
      return reddit('/api/v1/me').get().then(function (result) {
        user = result;
        return when.resolve(user);
      }).catch(function (error) {
        return when.reject(error);
      });
    }

    function getSavedPosts() {
      return getCurrentUser().then(function (user) {
        return reddit('/u/' + user.name + '/saved').get().then(function (result) {
          return when.resolve(result);
        }).catch(function (error) {
          return when.reject(error);
        });
      }).catch(function (error) {
        return when.reject(error);
      });
    }

    return router;
  };
} ());

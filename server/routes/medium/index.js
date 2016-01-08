(function () {

  'use strict';

  module.exports = function (medium, client) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');
    var _user = null;

    var LOGIN_STATE = 'MEDIUMLOGIN';

    router.get('/auth-url', function (req, res) {
      var url = client.getAuthorizationUrl(LOGIN_STATE, 'http://127.0.0.1:3000/#/medium/auth/callback', [
        medium.Scope.BASIC_PROFILE, medium.Scope.LIST_PUBLICATIONS
      ]);
      return res.send(url);
    });

    router.post('/login', function (req, res) {
      var AUTHORIZATION_CODE = req.body.code; /* url parameter "code" */
      var RETURNED_STATE = req.body.state; /* url parameter "state"" */

      // Exit if the state given is invalid. This is an optional
      // check, but is recommended if you set a state in 
      // `reddit.getExplicitAuthUrl`
      if (RETURNED_STATE !== LOGIN_STATE) {
        console.error('State is not the same as the one set!');
        return res.status(500).send('State is not the same as the one set!');
      } else {
        return client.exchangeAuthorizationCode(AUTHORIZATION_CODE, 'http://127.0.0.1:3000/#/medium/auth/callback', function (err, token) {
          if (err) {
            return res.status(500).send(JSON.stringify(err));
          }

          return res.send(JSON.stringify(token));
        });
      }
    });

    router.get('/me', function (req, res) {
      // Print out stats about the user, that's it.
      return client.getUser(function (err, user) {
        if (err) {
          return res.status(500).send(JSON.stringify(err, null, 4));
        }
        _user = user;
        return res.send(JSON.stringify(user, null, 4));
      });
    });

    router.get('/publications', function (req, res) {
      // Print out stats about the user, that's it.
      if (_user) {
        return client.getPublicationsForUser({
          userId: _user.id
        }, function (err, pubs) {
          if (err) {
            return res.status(500).send(JSON.stringify(err, null, 4));
          }
          pubs = pubs || [];
          return res.send(JSON.stringify(pubs, null, 4));
        });
      } else{
        return res.status(400).send('No user');
      }
    });

    router.get('/bookmarked', function (req, res) {
      return request('https://medium.com/me/bookmarks', function (error, response, body) {
        if (error) {
          return res.status(500).send(error);
        }
        return res.send(response);
      });
    });

    return router;
  };
} ());

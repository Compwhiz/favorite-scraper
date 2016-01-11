(function () {

  'use strict';

  module.exports = function (twitter) {
    var express = require('express');
    var router = express.Router();
    // var request = require('request');

    var user = null;
    var request_token = null;
    var request_token_secret = null;
    var access_token = null;
    var access_token_secret = null;

    // var apiBase = 'https://api.twitter.com/';

    router.get('/request-token', function (req, res) {
      return twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
        if (error) {
          console.log("Error getting OAuth request token : " + error);
          return res.status(500).send(error);
        } else {
          
          //store token and tokenSecret somewhere, you'll need them later; redirect user
          request_token = requestToken;
          request_token_secret = requestTokenSecret;

          return res.send([requestToken, requestTokenSecret, results]);
        }
      });
    });

    router.get('/auth-url', function (req, res) {
      if (request_token) {
        var url = twitter.getAuthUrl(request_token);
        return res.send(url);
      }
      return res.sendStatus(400);
    });

    router.post('/login', function (req, res) {
      var OAUTH_TOKEN = req.body.oauth_token; /* url parameter "code" */
      var OAUTH_VERIFIER = req.body.oauth_verifier; /* url parameter "state"" */

      twitter.getAccessToken(OAUTH_TOKEN, request_token_secret, OAUTH_VERIFIER, function (error, accessToken, accessTokenSecret, results) {
        if (error) {
          console.log(error);
          return res.status(500).send(error);
        } else {

          access_token = accessToken;
          access_token_secret = accessTokenSecret;

          return res.send(results);
        }
      });
    });

    router.get('/favorites', function (req, res) {
      return twitter.favorites('list', {}, access_token, access_token_secret, function (error, tweets, response) {
        if (error) {
          return res.status(500).send(error);
        }
        return res.send(tweets);
      });
    });

    return router;
  };
} ());

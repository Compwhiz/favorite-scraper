/**
 * Split into declaration and initialization for better startup performance.
 */
var validator;
var cheerio;
var Twit;
var ig;
var request;

var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function (req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = function (req, res, next) {
  cheerio = require('cheerio');
  request = require('request');

  request.get('https://news.ycombinator.com/', function (err, request, body) {
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(body);
    var links = [];
    $('.title a[href^="http"], a[href^="https"]').each(function () {
      links.push($(this));
    });
    res.render('api/scraping', {
      title: 'Web Scraping',
      links: links
    });
  });
};

/**
 * GET /api/twitter
 * Twiter API example.
 */
exports.getTwitter = function (req, res, next) {
  Twit = require('twit');

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  return T.get('favorites/list', function (err, list) {
    if (err) {
      return next(err);
    }
    return res.send(list);
  });
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = function (req, res, next) {
  req.assert('tweet', 'Tweet cannot be empty.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twitter');
  }

  var token = _.find(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.post('statuses/update', { status: req.body.tweet }, function (err, data, response) {
    if (err) {
      return next(err);
    }
    req.flash('success', { msg: 'Tweet has been posted.' });
    res.redirect('/api/twitter');
  });
};

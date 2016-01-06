(function () {

  'use strict';
  var express = require('express');
  var router = express.Router();
  // var db = require('diskdb');
  // db = db.connect('server/db', ['todos']);

  /* GET home page. */
  router.get('/', function (req, res) {
    res.render('index');
  });

  module.exports = router;

} ());

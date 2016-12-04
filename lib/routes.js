'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Create an Express Router, to contain our custom routes.
 */
var router = express.Router();

/**
 * Define the route for our homepage.
 */

router.get('/', stormpath.getUser, function(req, res) {
  res.render('home');
});

router.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.render('dashboard');
});

/**
 * When someone visits /profile, render the profile form.
 */

router.get('/profile', stormpath.loginRequired, function(req, res) {
  res.render('profile');
});

/**
 * When someone posts the profile form, read the data and save it to the
 * custom data object on the account.  The body-parser library is used
 * for parsing the form data.
 */

router.post('/profile', bodyParser.urlencoded({extended: false}), stormpath.loginRequired, function(req, res, next) {
  for (var key in req.body) {
    req.user.customData[key] = req.body[key];
  }

  req.user.customData.save(function(err) {
    if (err) {
      return next(err);
    }
    res.render('profile');
  });
});

/**
 * Generate an API key for the account
 */

router.post('/apiKeys', stormpath.loginRequired, function (req, res) {
  req.user.createApiKey(function (err, apiKey) {
    if (err) {
      res.status(400).end('Oops!  There was an error: ' + err.userMessage);
    }else{
      res.redirect('/dashboard')
    }
  });
});

/**
 * Generate an API key for the account
 */

router.get('/secret', stormpath.apiAuthenticationRequired, function (req, res) {
  res.json({
    message: "Meow, nice to meet you" + req.user.fullName + "you're authenticated"
  });
});

module.exports = router;

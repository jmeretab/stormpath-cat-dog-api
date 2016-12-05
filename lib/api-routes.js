'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Router for Cat-Dog API endpoints
 */
var router = express.Router();


/**
 * Cat endpoint, can only be accessed if the user is in the group "Cat People"
 */

router.get('/cat', stormpath.apiAuthenticationRequired, stormpath.groupsRequired(['Cat People']), function (req, res) {
  res.json({
    message: "Nice to meet you " + req.user.fullName + ". Here's your cat! Meow!"
  });
});

/**
 * Dog endpoint, can be accessed by anyone
 */

router.get('/dog', stormpath.apiAuthenticationRequired, function (req, res) {
  res.json({
    message: "Nice to meet you " + req.user.fullName + ". Here's your dog! Woof!"
  });
});


module.exports = router;
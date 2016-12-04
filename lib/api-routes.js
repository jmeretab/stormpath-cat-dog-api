'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Router for API dashboard routes
 */
var router = express.Router();


/**
 * Cat endpoint, can only be accessed if the user is a cat person
 */

router.get('/cat', stormpath.apiAuthenticationRequired, stormpath.groupsRequired(['Cat People']), function (req, res) {
  res.json({
    message: "Meow! Nice to meet you " + req.user.fullName + ". You're a cat person!"
  });
});


module.exports = router;
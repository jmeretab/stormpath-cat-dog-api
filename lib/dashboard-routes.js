'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Router for API dashboard routes
 */
var router = express.Router();

/**
 * Define the route for our homepage.
 */

function isUserInGroups(user, groups, callback) {
  var isInGroup = false;
  var done = groups.length;

  user.getGroups(function (err, userGroups) {
    if (err) {
      //logger.info('Could not fetch user ' + req.user.email + '\'s groups.');
      return callback(null, false);
    }

    // Iterate through each group on the user's account, checking to see
    // whether or not it's one of the required groups.
    userGroups.each(
      function (group, iterateNext) {
        if (groups.indexOf(group.name) > -1) {
          if (--done === 0) {
            isInGroup = true;
          }
        }
        iterateNext();
      },
      function () {
        callback(null, isInGroup);
      }
    );
  });
}

router.get('/', stormpath.getUser, function(req, res) {
  res.render('home');
});

/**
 * When someone posts the profile form, read the data and save it to the
 * custom data object on the account.  The body-parser library is used
 * for parsing the form data.
 */

router.post('/dashboard', bodyParser.urlencoded({extended: false}), stormpath.loginRequired, function(req, res, next) {
  
  var client = req.app.get('stormpathClient');

  // pull flag of whether or not the user is a cat person
  var catPerson = req.body['catPerson'];

  // retrieve Cat People gropu
  client.getGroups({name:'Cat People'}, function (err, groups) {
    if (err) {
      return console.error(err);
    }
    var group = groups.items[0];

    // if the user will be a cat person, add them to the group
    if (catPerson){
      group.addAccount(req.user, function (err, membership) {
        if(err && err.status != 409){
          res.sendStatus(500);
        }
        res.redirect('/dashboard')
      });
    }
    // if not, remove them from the group
    else{
      group.getAccountMemberships({ expand: 'account' }, function (err, memberships) {
        if(err){
          res.sendStatus(500)
        }
        memberships.each(function (membership) {
          if (membership.account.email == req.user.email){
            membership.delete();
          }
        });
        res.redirect('/dashboard')
      });
    }
  });
});

router.get('/dashboard', stormpath.loginRequired, function(req, res) {
  isUserInGroups(req.user,['Dog People'],function(err,result){
    if(err){
      res.sendStatus(500);
    }
    var dogPerson = result;
    isUserInGroups(req.user,['Cat People'],function(err,result){
      if(err){
        res.sendStatus(500);
      }
      var catPerson = result;
      res.render('dashboard',{dogPerson:dogPerson, catPerson:catPerson});
    })
  });
});

/**
 * When someone visits /profile, render the profile form.
 */

router.get('/profile', stormpath.loginRequired, function(req, res) {
  res.render('profile');
});



module.exports = router;

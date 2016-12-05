'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Router for API dashboard routes
 */
var router = express.Router();


/**
 * Display the frontend home page
 */

router.get('/', stormpath.getUser, function(req, res) {
  if(req.user){
    res.redirect('/dashboard');
  }
  else{
    res.render('home')
  }
});

/**
 * When someone posts the dashboard form, update the user's membership
 * in the 'Cat People' group.
 */

router.post('/dashboard', bodyParser.urlencoded({extended: false}), stormpath.loginRequired, function(req, res, next) {
  
  var client = req.app.get('stormpathClient');

  // pull flag of whether or not the user is a cat person
  var catPerson = req.body['catPerson'];

  // retrieve Cat People group
  client.getGroups({name:'Cat People'}, function (err, groups) {
    if (err) {
      return console.error(err);
    }
    var group = groups.items[0];

    // if the user elected to be a cat person, add them to the group
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

/**
 * Helper method for checking if a user is in a group
 */
function isUserInGroups(user, groups, callback) {
  var isInGroup = false;
  var done = groups.length;

  user.getGroups(function (err, userGroups) {
    if (err) {
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

/**
 * Display the API developer dashboard page
 */
router.get('/dashboard', stormpath.loginRequired, function(req, res) {
  isUserInGroups(req.user,['Cat People'],function(err,result){
    if(err){
      res.sendStatus(500);
    }
    var catPerson = result;
    res.render('dashboard',{catPerson:catPerson});
  })
});


module.exports = router;

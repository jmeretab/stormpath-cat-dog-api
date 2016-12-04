'use strict';

var express = require('express');
var stormpath = require('express-stormpath');

var routes = require('./lib/routes');

/**
 * Create the Express application.
 */
var app = express();

/**
 * Application settings.
 */
app.set('trust proxy',true);
app.set('view engine', 'jade');
app.set('views', './lib/views');
app.locals.siteName = 'CatDog API Dashboard';

/**
 * Stormpath initialization.
 */

console.log('Initializing Stormpath');

app.use(stormpath.init(app, {
  expand: {
    customData: true,
    apiKeys: true
  },
  web: {
    login: {
      nextUri: "/dashboard"
    }
  },
  // Generate an API key for the user when they log in
  postRegistrationHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just registered!');
    next();
  }
}));

/**
 * Route initialization.
 */
app.use('/', routes);

app.on('stormpath.ready',function () {
  console.log('Stormpath Ready');
});

/**
 * Start the web server.
 */
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening on http://localhost:' + port);
});


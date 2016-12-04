'use strict';

var express = require('express');
var stormpath = require('express-stormpath');

var dashboardRoutes = require('./lib/dashboard-routes');
var apiRoutes = require('./lib/api-routes');

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
    apiKeys: true,
    groups: true
  },
  web: {
    login: {
      nextUri: "/dashboard"
    },
    register: {
      nextUri: "/dashboard"
    }
  },
  // Automatically generate an API key for the user when they log in
  postRegistrationHandler: function (account, req, res, next) {
    req.user.createApiKey(function (err, apiKey) {
	    if (err) {
	      res.status(400).end('Oops!  There was an error: ' + err.userMessage);
	    }else{
	     	next();
	    }
  	});
  }
}));

/**
 * Route initialization.
 */

// API routes
app.use('/api', apiRoutes);

// Developer dashboard routes
app.use('/', dashboardRoutes);

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


var util = require("./util"),
    _ = require('lodash'),
    express = require('express'),
    userAPI = express.Router(),
    db = require("../db/index"),
    User = db.models.User;


// Helpers functions
// ------------

// validates given email

var validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}


// removes password from user object

var sanitizeUser = function(user) {
  return _.omit(user, 'password');
}

// User API
// ===================
//
// REST API for creating, updating and deleting users

var listUsers = function(req, res, next) {
  console.log(req.user)
	User.findAll(function (err, users) {
		if (err) next(err);
    res.json(_.map(users, sanitizeUser));
	});
}

userAPI.route('/users')
  .get(listUsers)


// Register user
// -----------

var registerUser = function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var data = req.body.data;

  if(!validateEmail(email)) {
    res.status(400).json({
      success: false,
      message: 'This is not email. Please provide real email address.'
    });
  }

  if(password.length <= 5) {
    res.status(400).json({
      success: false,
      message: 'Password is not strong enough. Please use at least 6 characters.'
    });
  }

	User.create(email, password, data, util.out(res, next));
}


userAPI.route('/register')
  .post(registerUser);


// Authenticate user
// -----------

// Create a new authorization (aka login)
// -----------
// 
// Takes email and password and returns a token if login was successful
// That token must be sent to the API along with each future request
// 
// 
// POST /api/authenticate
// 
// Input:
// 
// {
//   "email": "x@y.com",
//   "password": "abcd"
// }
// 
// Response:
// 
// Status: 200 OK
// 
// {
//   "token": "mysessiontoken"
// }

var authenticate = function(req, res, next) {
  console.log('/api/authenticate called');
  var email = req.body.email;
  var password = req.body.password;
  var secret = req.app.get('tokenSecret');

  // checks if given email is valid  
  User.authenticate(email, password, secret, util.out(res, next));
};

userAPI.route('/authenticate')
  .post(authenticate);

module.exports = userAPI;
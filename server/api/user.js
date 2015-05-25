var util = require("./util"),
    _ = require('lodash'),
    express = require('express'),
    userAPI = express.Router(),
    db = require("../db/index"),
    User = db.models.User;


// Helpers functions
// ------------
// 
// Validates a given email address

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

// List Users
// -----------

var listUsers = function(req, res, next) {
	User.findAll(function (err, users) {
		if (err) next(err);
    res.json(_.map(users, sanitizeUser));
	});
}


// Create user
// -----------
// 
// Takes user data 
// 
// 
// POST /api/users
// 
// Input:
// 
// {
//   "username": 
//   "email": "x@y.com",
//   "password": "abcd"
// }
// 

var createUser = function(req, res, next) {
  var userSpec = req.body;

  if(!validateEmail(userSpec.email)) {
    return res.status(400).json({
      message: 'This is not email. Please provide real email address.'
    });
  }

  if(userSpec.password.length <= 5) {
    return res.status(400).json({
      message: 'Password is not strong enough. Please use at least 6 characters.'
    });
  }

	User.create(userSpec, util.out(res, next));
}

userAPI.route('/users')
  .post(createUser)
  .get(util.checkToken, listUsers);


// Authenticate user
// -----------
// 
// Takes email and password and returns a token if login was successful
// That token must be sent to the API along with each future request
// 
// header: Authorization: Bearer YOUR_TOKEN_HERE)
// 
// 
// POST /api/authenticate
// 
// Input:
// 
// {
//   "username": "x@y.com",
//   "password": "abcd"
// }
// 
// Response:
// 
// Status: 200 OK
// 
// {
//   "token": "sessionToken",
//   "user": {
//     "username": "johndoe"
//     "name": "John Doe"
//   }
// }
//
// TODO Daniel:
//   - change API to use username instead or in addition to email
//   - make token secure
//   - return minimal user information in user property

var authenticate = function(req, res, next) {
  console.log('/api/authenticate called');
  var username = req.body.username;
  var password = req.body.password;

  // checks if given email is valid  
  User.authenticate(username, password, function(err, data) {
    if(err) return res.status(401).json({message: err.message});
    res.status(200).json(data);
  });
};

userAPI.route('/authenticate')
  .post(authenticate);

module.exports = userAPI;
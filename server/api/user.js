var util = require("./util"),
    express = require('express'),
    userAPI = express.Router(),
    db = require("../db/index"),
    User = db.models.User;

// User API
// ===================
//
// REST API for creating, updating and deleting users

var authentication = function(req, res, next) {
  var email = 'req.body.email';
  var password = 'req.body.password';
  User.authenticate(email, password, util.out(res, next));
};

userAPI.route('/login')
  .get(authentication)

module.exports = userAPI;


// module.exports = function(app) {
//   var db = app.db;

//   var User = db.models.User;

//   // Create a new authorization (aka login)
//   // -----------
//   // 
//   // Takes email and password and returns a token if login was successful
//   // That token must be sent to the API along with each future request
//   // 
//   // 
//   // POST /documents
//   // 
//   // Input:
//   // 
//   // {
//   //   "email": "x@y.com",
//   //   "password": "abcd"
//   // }
//   // 
//   // Response:
//   // 
//   // Status: 200 OK
//   // 
//   // {
//   //   "token": "mysessiontoken"
//   // }

//   app.post('/api/login',
//     function(req, res, next) {
//       var email = req.body.email;
//       var password = req.body.password;
//       User.authenticate(email, password, util.out(res, next));
//     });
// };



// User API
// ===================
//
// All authentication-related stuff

// module.exports = function(app) {

//   // Authentication / Authorization
//   // -----------

//   app.post('/authorizations',
//     util.requires('user', 'client'),
//     function (req, res, next) {
//       var user = req.user;
//       var application = req.client;
//       authorizations.findOrCreate(user.username, application.uuid, 'all', util.out(res, next));
//     });

//   app.get('/authorizations',
//     util.requires('user'),
//     function (req, res, next) {
//       authorizations.findByUser(req.user.username, util.out(res, next));
//     });

//   app.put('/authorizations/:uuid',
//     errors.NotImplemented.asMiddleware());

//   app.delete('/authorizations/:uuid',
//     errors.NotImplemented.asMiddleware());

//   // Was GET /authorization
//   app.get('/authorizations/current',
//     util.requires('user', 'client'),
//     function (req, res, next) {
//       var user = req.user;
//       var application = req.client;
//       authorizations.findByUserAndApplication(user.username, application.uuid, util.out(res, next));
//     });

//   app.get('/authorizations/:uuid',
//     util.requires('user'),
//     function (req, res, next) {
//       authorizations.secureFindById(req.user.username, req.params.uuid, util.out(res, next));
//     });

//   // Users
//   // =====

//   function sanitizeUser (user) {
//     return _.omit(user, 'hash', 'data');
//   }

//   app.get('/users',
//     function(req, res, next) {
//       users.findAll(function (err, users) {
//         if (err) next(err);
//         else res.json(_.map(users, sanitizeUser));
//       });
//     });

//   app.get('/users/:username',
//     function (req, res, next) {
//       users.findById(req.params.username, function (err, user) {
//         if (err) next(err);
//         else res.json(sanitizeUser(user));
//       });
//     });


//   // Register user
//   // -----------

//   app.post('/register',
//     util.requires('client'),
//     function(req, res, next) {
//       var body = req.body;

//       var client = req.client;

//       var user = {
//         email: body.email,
//         username: body.username,
//         name: body.name,
//         password: body.password
//       };

//       users.createSafe(user, function (err, username) {
//         if (err) next(err);
//         else authorizations.findOrCreate(username, client.uuid, 'all', function(err, authorization) {
//           if (err) next(err);
//           else res.json({
//             "status": "ok",
//             "token": authorization.token,
//             "username": body.username
//           });
//         });
//       });
//     });
// };
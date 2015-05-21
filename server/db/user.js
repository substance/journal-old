var knex = require('./connect');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var User = exports;


// How many rounds or iterations the key setup phase uses
var SALT_ROUNDS = 10;

// Create user schema
// ------------
// 
// Drops table if exists

User.createSchema = function(cb) {
  knex.schema.dropTableIfExists('users')
    .createTable('users', function(t) {
      t.string('email').primary();
      t.string('password');
      t.string('token');
      t.date('created_at');
      t.date('updated_at');
      t.boolean('published');
      t.json('data');
      t.primary(['email', 'column2']);
    })
    .then(function() {
      console.log('done creating User schema.');
      cb(null);
    })
    .catch(cb);
};


// Bcrypt password
// ------------
// 
// Create hashed password from given one

User.bcryptPassword = function(password, cb) {
  bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
    if (err) return cb(err);
    // hash the password along with salt
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return cb(err);
      // override the cleartext password with the hashed one
      password = hash;
      cb(null, password);
    });
  });
};


// Compare password
// ------------
// 
// Compares given password with hashed one

User.comparePasswords = function(candidatePassword, password, cb) {
  bcrypt.compare(candidatePassword, password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


// Create a new user
// ------------

User.create = function(email, password, data, cb) {
  var jsonData = JSON.stringify(data, null, "  ");
  this.bcryptPassword(password, function(err, bcryptedPassword) {
    knex.table('users').insert({
      data: jsonData,
      email: email,
      password: bcryptedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }).then(function(user) {
        if (_.isEmpty(user)) {
          cb(null, {
            success: false,
            message: 'Something goes wrong. Try again.'
          })
        } else if (user) {
          cb(null, {
            success: true,
            message: 'New user has been registered. Welcome!'
          })
        }
      })
      .catch(cb);
  })
};

// Return all available docs
// ------------
// 
// TODO: only return published docs

User.findAll = function(cb) {
  knex.select().table('users')
    .then(function(result) { cb(null, result)})
    .catch(cb);
};

// Return all available docs
// ------------
// 

User.get = function(email, cb) {
  knex('users').where('email', email)
    .then(function(result) { cb(null, result)})
    .catch(cb);
};


// Return all available docs
// ------------
// 

User.authenticate = function(email, password, secret, cb) {
  var self = this;

  knex('users').where('email', email)
    .then(function(user) {

      // check if user exists
      if (_.isEmpty(user)) {
        cb(null, {
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else if (user) {

        // check if password matches
        self.comparePasswords(password, user[0].password, function(err, isMatch){
          if (!isMatch) {
            cb(null, {
              success: false,
              message: 'Authentication failed. Password is wrong.'
            })
          } else {
            var token = jwt.sign(user, secret, {
              expiresInMinutes: 1440 // expires in 24 hours
            });
            cb(null, {
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        })
      }
    })
    .catch(cb);
};

  //return User;
//};

// User.findOne({
//     name: req.body.name
//   }, function(err, user) {

//     if (err) throw err;

//     if (!user) {
//       res.json({ success: false, message: 'Authentication failed. User not found.' });
//     } else if (user) {

//       // check if password matches
//       if (user.password != req.body.password) {
//         res.json({ success: false, message: 'Authentication failed. Wrong password.' });
//       } else {

//         // if user is found and password is right
//         // create a token
//         var token = jwt.sign(user, app.get('superSecret'), {
//           expiresInMinutes: 1440 // expires in 24 hours
//         });

//         // return the information including token as JSON
//         res.json({
//           success: true,
//           message: 'Enjoy your token!',
//           token: token
//         });
//       }   

//     }

//   });
// });
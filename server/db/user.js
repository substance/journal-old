var config = require('config');
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
// Warning: Drops table if exists

User.createSchema = function(cb) {
  knex.schema.dropTableIfExists('users')
    .createTable('users', function(t) {
      t.string('username').primary();
      t.string('email').unique();
      t.string('name');
      t.string('location');
      t.string('password');
      t.string('token'); // JSON Web Token goes here
      t.timestamps();

      // TODO: not sure if we want a generic data container
      // e.g. the name property better sits on the record
      // level so we can query for author names.
      t.json('data');
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
//
// Example params object:
// 
// {
//   username: "johndoe",
//   password: "plainpassword",
//   email: "john@doe.com",
//   name: "John Doe"
// }

User.create = function(userSpec, cb) {
  this.bcryptPassword(userSpec.password, function(err, bcryptedPassword) {
    knex.table('users').insert({
      username: userSpec.username,
      email: userSpec.email,
      name: userSpec.name,
      password: bcryptedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }).then(function(user) {
        if (_.isEmpty(user)) {
          cb(null, 400, {
            message: 'Something went wrong. Please try again.'
          });
        } else if (user) {
          cb(null, 200, {
            message: 'New user has been registered. Welcome!'
          });
        }
      })
      .catch(cb);
  })
};

// Return all available users
// ------------
// 

User.findAll = function(cb) {
  knex.select().table('users')
    .then(function(users) { 
      _.each(users, function(user) {
        user.created_at = new Date(user.created_at);
        user.updated_at = new Date(user.updated_at);
      });
      cb(null, users);
    })
    .catch(cb);
};

// Return all available docs
// ------------
// 

User.get = function(email, cb) {
  knex('users').where('email', email)
    .then(function(result) { cb(null, 200, result)})
    .catch(cb);
};

// Authenticate user based on email and password
// ------------
// 

User.authenticate = function(username, password, cb) {
  var self = this;

  knex('users')
    .where('username', username)
    // .orWhere('email', email)
    .then(function(users) {
      user = users[0];

      console.log('JEY');

      // check if user exists
      if (!user) {
        return cb(null, 401, {
          message: 'Authentication failed. User not found.'
        });
      }

      // check if password matches
      self.comparePasswords(password, user.password, function(err, isMatch) {
        if (err) {
          cb(null, 401, {
            message: err // an error occured
          });
        } else if (!isMatch) {
          cb(null, 401, {
            message: 'Authentication failed. Password is wrong.'
          });
        } else {
          // Michael, this is what will go out to req.user with some additional stuff
          var profile = {
            username: user,
            created_at: user.created_at,
            updated_at: user.updated_at
          };
          // TODO: Daniel, will the expires column be updated
          // while a user uses the system? that would be nice if we can push it
          // back, so you are not automatically logged out if you use the system
          // daily... however, maybe this could also be a security risk
          var token = jwt.sign(profile, config.secret, {
            issuer: user.username,
            expiresInMinutes: 60*24 // expires in 24 hours
          });
          cb(null, 200, {
            message: 'Enjoy your token!',
            token: token,
            user: {
              username: user.username,
              name: user.name
            }
          });
        }
      })
    })
    .catch(cb);
};
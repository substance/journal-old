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
      t.string('bio');
      t.string('location');
      t.string('password');

      t.string('token'); // do we actually need this?
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

    userSpec.password = bcryptedPassword;
    userSpec.created_at = new Date();
    userSpec.updated_at = new Date();

    knex.table('users').insert(userSpec)
    .asCallback(function(err, user) {
      if(err) return cb(err, 400, {});
      if (_.isEmpty(user)) {
        return cb(new Error('Something went wrong. Please try again.'));
      } else if (user) {
        cb(null, {
          message: 'New user has been registered. Welcome!'
        });
      }
    });
  })
};

// Return all available users
// ------------
// 

User.findAll = function(cb) {
  knex.select().table('users')
    .asCallback(function(err, users) {
      if(err) return cb(err);
      _.each(users, function(user) {
        user.created_at = new Date(user.created_at);
        user.updated_at = new Date(user.updated_at);
      });
      return cb(null, users);
    });
};

// Return all available docs
// ------------
// 

User.get = function(username, cb) {
  knex('users').where('username', username)
    .asCallback(function(err, item) {
      if(err) return cb(err);
      return cb(null, item[0])
    });
};


User.update = function(username, userSpec, cb) {
  var self = this;

  this.bcryptPassword(userSpec.password, function(err, bcryptedPassword) {
    if (userSpec.password) {
      userSpec.password = bcryptedPassword;  
    } else {
      delete userSpec.password;
    }
    
    knex('users').where('username', username).update(userSpec)
      .asCallback(function(err, user) {
        if(err) return cb(err);
        return self.get(username, cb);
      });
  });
};


User.remove = function(id, user, cb) {
  knex('users').where('id', id).del()
    .asCallback(function(err) {
      if(err) return cb(err);
      return cb(null);
    });
};

// Authenticate user based on email and password
// ------------
// 

User.authenticate = function(username, password, cb) {
  var self = this;

  knex('users')
    .where('username', username)
    // .orWhere('email', email)
    .asCallback(function(err, users) {
      if(err) return cb(err);
      
      var user = users[0];

      // check if user exists
      if (!user) {
        return cb(new Error('Authentication failed. User not found.'));
      }

      // check if password matches
      self.comparePasswords(password, user.password, function(err, isMatch) {
        if (err) {
          return cb(err);
        } else if (!isMatch) {
          return cb(new Error('Authentication failed. Password is wrong.'));
        } else {
          // Michael, this is what will go out to req.user with some additional stuff
          var profile = {
            username: user.username,
            created_at: user.created_at,
            updated_at: user.updated_at
          };
          
          var token = jwt.sign(profile, config.secret, {
            issuer: user.username,
            expiresInMinutes: 60*24 // expires in 24 hours
          });

          return cb(null, {
            message: 'Enjoy your token!',
            token: token,
            user: {
              username: user.username,
              name: user.name
            }
          });
        }
      })
    });
};
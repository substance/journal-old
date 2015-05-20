var knex = require('./connect');
var bcrypt = require('bcrypt');
var _ = require('lodash');

var User = exports;

// Create document schema
// ------------
// 
// Drops table if exists

User.createSchema = function(cb) {
  knex.schema.dropTableIfExists('users')
    .createTable('users', function(t) {
      t.string('email').primary();
      t.string('password');
      t.string('token');
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

User.cryptPassword = function(password, cb) {

};

User.comparePassword = function(candidatePassword, cb) {

};

// Create a new user
// ------------
// 


// User.create = function (user, cb) {
//   bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
//     if (err) cb(err, null);
//     else db.query(INSERT_SQL, [user.username, user.email, user.name, hash], function (err, results) {
//       cb(err, user.username);
//     });
//   });
// };

User.create = function(data, username, cb) {
  var jsonStr = JSON.stringify(data, null, "  ");
  knex.table('users').insert({data: jsonStr})
    .then(function() { cb(null) })
    .catch(cb);
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

User.authenticate = function(email, password, cb) {
  knex('users').where('email', email)
    .then(function(result) {
      if (_.isEmpty(result)) {
        cb(null, {
          success: false,
          message: 'Authentication failed. User not found.'
        })
      }
      cb(null, result)
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
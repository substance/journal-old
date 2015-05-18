var bcrypt = require('bcrypt');

module.exports = function(knex) {

  var Document = {};

  // Create document schema
  // ------------
  // 
  // Drops table if exists

  User.createSchema = function(cb) {
    knex.schema.dropTableIfExists('documents')
      .createTable('documents', function(t) {
        t.string('email').primary();
        t.
        t.boolean('published');
        t.json('data');
        t.primary(['email', 'column2']).
      })
      .then(function() {
        console.log('done creating Document schema.');
        cb(null);
      })
      .catch(cb);
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
      .then(function(result) { cb(null, result)})
      .catch(cb);
  };

  return Document;
};

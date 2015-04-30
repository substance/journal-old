var _ = require('underscore');
var db = require('../db');
var bcrypt = require('bcrypt');
var errors = require('../errors');
var reserved = require('../reserved');

var AUTHENTICATE_SQL = 'SELECT * FROM Users WHERE (email = $1 OR username = $1);',
    ALL_USERS_SQL = 'SELECT * FROM Users;',
    BY_EMAIL_SQL = 'SELECT * FROM Users WHERE email = $1;',
    BY_ID_SQL = 'SELECT * FROM Users WHERE username = $1;',
    INSERT_SQL = 'INSERT INTO Users (username, email, name, hash, created_at) VALUES ($1, $2, $3, $4, NOW());';

var SALT_ROUNDS = 10;

var User = {};

User.findAll = function(cb) {
  db.query(ALL_USERS_SQL, db.many(cb, 'No users found'));
};

User.findById = function (id, cb) {
  db.query(BY_ID_SQL, [id], db.one(cb, 'No user found for '+id));
};

User.findByEmail = function (email, cb) {
  db.query(BY_EMAIL_SQL, [email], db.one(cb, 'No user found for '+email));
};

User.findByLogin = function (login, cb) {
  db.query(AUTHENTICATE_SQL, [login], db.one(cb, 'No user found for '+login));
};

// Gosh, something better?
User.validate = function (email, username, name, password, cb) {
  try {
    username = ((username || '') + '').trim();

    if (!email || email.indexOf('@') < 0) {
      throw new errors.WrongFieldValue('email', email);
    }

    if (!username || !/^[a-z0-9\_\-]{2,}$/i.test(username)) {
      throw new errors.WrongFieldValue('username', username);
    }

    if (!name || name.length < 4) {
      throw new errors.WrongFieldValue('name', name);
    }

    if (!password || password.length < 6) {
      throw new errors.WrongFieldValue('password', "");
    }

    if (reserved.usernames.indexOf(username) >= 0) {
      throw new errors.WrongValue("Username '"+username+"' is reserved");
    }
  }
  catch (err) {
    return cb(err, false);
  }

  User.findByEmail(email, function (err, user) {
    if (!(err instanceof errors.NoRecordFound)) {
      cb(new errors.WrongValue("Duplicate email"));
    } else User.findById(username, function (err, user) {
      if (!(err instanceof errors.NoRecordFound)) {
        cb(new errors.WrongValue("Duplicate username"));
      } else cb(null, true);
    });
  });
};

// Applies validation
User.createSafe = function (user, cb) {
  User.validate(user.email, user.username, user.name, user.password, function (err, valid) {
    if (err) cb(err, null);
    else User.create(user, cb);
  });
};

User.create = function (user, cb) {
  bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
    if (err) cb(err, null);
    else db.query(INSERT_SQL, [user.username, user.email, user.name, hash], function (err, results) {
      cb(err, user.username);
    });
  });
};

module.exports = User;
var _ = require('substance/helpers');
var pg = require('pg');
var config = require('../config');
var errors = require('./errors');

// Configuration
var CONNECTION_STRING = config.postgres_conn;

// Expose db functionality
var db = module.exports = {};
db.configure = _.bind(_.extend, _, pg.defaults);

db.query = function () {
  var args = arguments;
  var callback = arguments[arguments.length - 1];

  var cb = function (err, client) {
    if (err) return callback(err, null);
    // TODO: we should wrap this into a try-catch block to
    // fail safely on errors in the callback (e.g., even on syntax errors)
    var query = client.query.apply(client, args);
    // End the query
    query.on('end', function() { client.end(); });
  };

  if (CONNECTION_STRING) {
    pg.connect(CONNECTION_STRING, cb);
  } else {
    pg.connect(cb);
  }
};

db.uuid = function (prefix) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
      uuid = [],
      radix = 16,
      len = 32;

  var r, i;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return (prefix ? prefix : "") + uuid.join('');
};

db.one = function (cb, message) {
  return function (err, results) {
    if (err) return cb(err);
    else if (results && results.rows && results.rows.length) {
      // we are wrapping into a try-catch block to be robust regarding errors in callback
      try {
        return cb(null, results.rows[0]);
      } catch (err) {
        console.log("db.one caught exception:", err, err.stack);
        return cb(err);
      }
    }
    else return cb(new errors.NoRecordFound(message));
  };
};

db.many = function(cb, message) {
  return function(err, results) {
    if (err) return cb(err);
    else {
      // we are wrapping into a try-catch block to be robust regarding errors in callback
      try {
        cb(null, results.rows);
      } catch (err) {
        console.log("db.many caught exception:", err, err.stack);
        cb(err);
      }
    }
  };
};
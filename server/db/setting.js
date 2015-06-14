var config = require('config');
var knex = require('./connect');
var _ = require('lodash');
var async = require('async');


var Setting = exports;

// Value might be a JSON value (true,false, {}, []) or just a string
function convertValue(val) {
  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
}

Setting.get = function(key, cb) {
  knex('settings').where('key', key)
    .asCallback(function(err, rows) {
      if(err) return cb(null, undefined);
      return cb(null, convertValue(rows[0].value));
    });
};

Setting.set = function(key, val, cb) {
  knex('settings').where('key', key)
    .then(function(rows) {
      if (rows.length > 0) {
        // Update setting
        knex('settings').where('key', key).update({value: val}).asCallback(cb);        
      } else {
        // Inserting setting
        knex.table('settings').insert({key: key, value: val}).asCallback(cb);
      }
    }).catch(cb);
};

Setting.getAll = function(cb) {
  var settings = {};

  knex.select().table('settings')
    .then(function(rows) {
      _.each(rows, function(row) {
        settings[row.key] = row.value;
      });
      cb(null, settings);
    }).catch(cb);
};

Setting.setMany = function(settings, cb) {
  var keys = Object.keys(settings);
  var self = this;

  function setSetting(key, cb) {
    console.log('setting', key, settings[key]);
    Setting.set(key, settings[key], cb);
  }
  
  async.eachSeries(keys, setSetting, cb);
};

// Seed the database

var db = require("./db");
var async = require("async");
var _ = require("substance/helpers");
var SCHEMA = require("../data/schema");


// Step 1: Flush the DB
// -------------------
// 

var flushDB = function(cb) {
  console.log('(1) flushing the database ...');
  var selectTables = function(cb) {
    var sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';";
    db.query(sql, function(err, data) {
      if (err) return cb(err);
      cb(err, _.pluck(data.rows, 'table_name'));
    });
  };

  var dropTable = function(tableName, cb) {
    console.log("dropping table:", tableName);
    var sql = "DROP TABLE " + tableName + ";";
    db.query(sql, cb);
  };
  
  selectTables(function(err, tables) {
    async.each(tables, dropTable, cb);
  });
};

// Step 2: Create schema from schema spec
// -------------------
// 

var createSchema = function(cb) {
  console.log('(2) creating the schema... ');
  
  var createTable = function(modelName, cb) {
    console.log('create', modelName);
    var fields = SCHEMA[modelName]
    var fieldSpecs = _.map(fields, function (type, field) {
        return field + ' ' + type;
    }).join(', ');
  };

  var modelNames = Object.keys(SCHEMA);
  console.log('tableNames', modelNames);
  async.each(modelNames, createTable, cb);
  cb(null);
};

// var createSchema = util.async.iterator({
//   before: function() { console.log("creating schema..."); },
//   selector: function() { return seed.schema; },
//   iterator: function(fields, name, cb) {
//     var fieldSpecs = _.map(fields, function (type, field) {
//         return field + ' ' + type;
//     }).join(', ');
//     var psql = ['CREATE TABLE IF NOT EXISTS ', name, ' (', fieldSpecs, ');'].join('');
//     // console.log("    creating table:", name);
//     db.query(psql, cb);
//   }
// });

// var populateTables = function(cb) {
//   console.log('populating tables ...');

//   var jobs = [];
//   _.each(seed.hub, function(hubSeed, type) {
//     jobs[type] = [];
//     var model = require('./model/'+type);

//     var subJobs = [];
//     _.each(hubSeed, function(obj) {
//       subJobs.push(function(cb) {
//         model.create(obj, cb);
//       });
//     });

//     jobs.push(function(cb) {
//       util.async.sequential(subJobs, function(err) {
//         cb(err);
//       });
//     });
//   });

//   util.async.sequential(jobs, cb);
// };

// Plant Seed to database
// this.plant = function(cb) {
//   var functions = [flushDB, createSchema, populateTables];
//   util.async.sequential(functions, cb);
// };

// Start the seeding process
async.series([
  flushDB,
  createSchema
]);

// var pg = require('pg');
// var connectionString = config.postgres_conn;

// var client = new pg.Client(connectionString);
// client.connect();

// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', function() { client.end(); });
var config = require('config');
var async = require("async");

var EXAMPLE_DOC = {
  "nodes": {
    "document": {
      "title": "Hello World"
    }
  }
};

// Initialize knex connection
// --------------
// 
// Uses config/default.json

var knex = require('knex')(config.database);

// Expose models
// --------------

var models = {
  Document: require("./document")(knex)
};

// Seed script
// --------------
// 
// Runs through all model definitions and calls createSchema

var seed = function(cb) {
  console.log('seeding the db...');
  var modelNames = Object.keys(models);
  async.eachSeries(modelNames, function(modelName, cb) {
    var Model = models[modelName];
    Model.createSchema(cb);
  }, function(err) {
    if (err) return cb(err);

    async.series([
      function(cb) {
        models.Document.create(EXAMPLE_DOC, cb);        
      },
      function(cb) {
        models.Document.findAll(function(err, docs) {
          console.log('alldocs', docs);
          cb(null);
        });
      }
    ], function(err, results) {
      if (err) {
        console.error(err);
        return cb(err);
      }
      cb(null);
    });
  });
};

// // export connection
module.exports = {
  models: models,
  seed: seed,
  knex: knex
};
var knex = require('./connect');
var async = require("async");


// Expose models
// --------------

var models = {
  Document: require("./document"),
  User: require("./user"),
  Setting: require("./setting")
};

// export connection
module.exports = {
  models: models,
  knex: knex
};
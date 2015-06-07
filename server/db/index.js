var knex = require('./connect');
var async = require("async");

var SAMPLE_DOC = require("../../data/sample_doc");

// Initialize knex connection
// --------------
// 
// Uses config/default.json

// Expose models
// --------------

var models = {
  Document: require("./document"),
  User: require("./user")
};

// export connection
module.exports = {
  models: models,
  knex: knex
};
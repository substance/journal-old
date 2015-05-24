var config = require('config');

// Initialize knex connection
// --------------
// 
// Uses config/default.json

var Knex = require('knex');

module.exports = new Knex(config.database);
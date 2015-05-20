var config = require('config');

// Initialize knex connection
// --------------
// 
// Uses config/default.json

var knex = require('knex')(config.database);

module.exports = knex;
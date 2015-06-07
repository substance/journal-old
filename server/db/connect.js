// Initialize knex connection
// --------------
// 

var Knex = require('knex');
var knexConfig = require('../../knexfile');
var environment = process.env.NODE_ENV || 'development';
var config = knexConfig[environment];
if (!config) {
  throw new Error('Could not find config for environment', environment);
}

module.exports = new Knex(config);
var user = require('./user'),
	document = require('./document'),
  settings = require('./settings'),
	util = require('./util'),
	_ = require('lodash'),
	express = require('express'),
	APIrouter = express.Router();

var apis = [
	document,
	user,
  settings
];

APIrouter.util = util;

_.each(apis, function(api){
	APIrouter.use(api);
});

module.exports = APIrouter;
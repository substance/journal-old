var user = require('./user'),
	document = require('./document'),
	_ = require('lodash'),
	express = require('express'),
	APIrouter = express.Router();

var apis = [
	document,
	user
];

_.each(apis, function(api){
	APIrouter.use(api);
});

module.exports = APIrouter;
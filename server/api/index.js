var user = require('./user'),
	_ = require('lodash'),
	express = require('express'),
	APIrouter = express.Router();

var apis = [
	user
];

_.each(apis, function(api){
	APIrouter.use(api);
});

module.exports = APIrouter;
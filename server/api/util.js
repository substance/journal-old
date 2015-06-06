var config = require('config');
var jwt = require('express-jwt');
var util = module.exports = {};

util.out = function (res, next) {
  return function (err, data) {
    if (err) {
    	return res.status(400).json({
    		message: err.message
    	});
    }
    res.status(200).json(data);
  };
};

util.checkToken = jwt({
  secret: config.secret
});

util.checkAuth = jwt({
  secret: config.secret,
  credentialsRequired: false
});
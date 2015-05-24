var config = require('config');
var jwt = require('express-jwt');
var util = module.exports = {};

util.out = function (res, next) {
  return function (err, status, data) {
    console.log('meeh', status, data);
    if (err) next(err);
    else res.status(status).json(data);
  };
};

util.checkToken = jwt({
  secret: config.secret
});
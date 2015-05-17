var util = module.exports = {};

util.out = function (res, next) {
  return function (err, data) {
    if (err) next(err);
    else res.json(data);
  };
}
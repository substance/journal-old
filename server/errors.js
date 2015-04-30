function defineError(clazz, parent) {
  /*jshint proto:true */
  parent || (parent = BaseError);
  clazz.__proto__ = parent;
  clazz.prototype = Object.create(parent.prototype);
  clazz.prototype.constructor = clazz;
  module.exports[clazz.name] = clazz;
  return clazz;
}

function BaseError () {
  throw new Error("BaseError cannot be instantiated");
}

BaseError.asMiddleware = function (message) {
  var clazz = this;
  return function (req, res, next) {
    next(new clazz(message));
  };
};

BaseError.__proto__ = Error;
BaseError.prototype.constructor = BaseError;

BaseError.prototype.toString = function () {
  return this.name + ': ' +this.message;
};

function prepareError(self, args, message) {
  Error.call(self);
  Error.captureStackTrace(self, args.callee);
  self.name = self.constructor.name;
  self.message = message || this.name;
}

// HTTP Errors
// -----------
//
// These Errors implement common HTTP errors.
//
// They are not meant to be used exclusively within routes. Can be used by data
// accessors (for example) to give a better insight to the app.

defineError(function BadRequest(message) {
  prepareError(this, arguments, message);
  this.status = 400;
});

defineError(function Unauthorized(message) {
  prepareError(this, arguments, message);
  this.status = 401;
});

defineError(function Forbidden(message) {
  prepareError(this, arguments, message);
  this.status = 403;
});

defineError(function NotFound(message) {
  prepareError(this, arguments, message);
  this.status = 404;
});

defineError(function NotAllowed(message) {
  prepareError(this, arguments, message);
  this.status = 405;
});

defineError(function InternalServerError(message) {
  prepareError(this, arguments, message);
  this.status = 500;
});

defineError(function NotImplemented(message) {
  prepareError(this, arguments, message);
  this.status = 501;
});


// Custom Errors
// -------------

defineError(function NoRecordFound(message) {
  prepareError(this, arguments, message);
  this.status = 404;
});

defineError(function WrongValue(message) {
  prepareError(this, arguments, message);
});

defineError(function WrongFieldValue(field, value) {
  var message = "Wrong value '"+value+"' for field '"+field+"'";
  prepareError(this, arguments, message);
  this.field = field;
  this.value = value;
}, exports.WrongValue);

defineError(function Parallel(errs) {
  prepareError(this, arguments, "Multiple errors");
  this.errors = errs || [];
  this.status = this.errors.reduce(function (memo, err) {
    return err.status || memo;
  }, 500);
});

exports.MaybeParallel = function (errs) {
  if (errs.length !== 1) {
    return new exports.Parallel(errs);
  } else {
    return errs[0];
  }
};

// Utils
// -----

exports.errorHandler = function () {
  return function (err, req, res, next) {
    if (req.accepts('html')) {
      next(err);
    } else if (req.accepts('json')) {
      res.status(err.status ? err.status : 500);
      res.json(err);
    } else {
      next(err);
    }
  };
};
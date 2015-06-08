var bcrypt = require('bcrypt');

var INSECURE_DEMO_PASSWORD = "123456";


var salt = bcrypt.genSaltSync(10);
var hashedPassword = bcrypt.hashSync(INSECURE_DEMO_PASSWORD, salt);

exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').insert({
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      bio: "I'm the Substance Journal System administrator.",
      location: "Linz",
      email: "admin@substance.io",
    })
  );
};
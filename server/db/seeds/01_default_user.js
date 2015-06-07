exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').insert({
      username: "admin",
      password: "123456",
      name: "Administrator",
      bio: "I'm the Substance Journal System administrator.",
      location: "Linz",
      email: "admin@substance.io",
    })
  );
};
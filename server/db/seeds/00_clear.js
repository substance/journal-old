exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('documents').del(),
    knex('users').del(),
    knex('settings').del()
  );
};
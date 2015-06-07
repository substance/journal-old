
exports.up = function(knex, Promise) {
  return knex.schema.createTable('settings', function(t) {
    t.string('key').primary();
    t.string('value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('settings');
};

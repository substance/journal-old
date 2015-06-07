
exports.up = function(knex, Promise) {
  return knex.schema.createTable('documents', function(table) {
    table.increments('id');
    table.string('creator');
    table.string('title');
    table.string('abstract');
    table.date('published_on');
    table.timestamps();
    table.json('data');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('documents');
};

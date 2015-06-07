
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.string('username').primary();
    t.string('email').unique();
    t.string('name');
    t.string('bio');
    t.string('location');
    t.string('password');
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};




// exports.up = function(knex, Promise) {
//   return knex.schema.createTable('papers', function(table) {
//     table.increments('id');
//     table.string('title');
//     table.text('abstract', 'mediumtext');
//     table.text('body', 'longtext');
//     table.timestamps();
//   });
// };

// exports.down = function(knex, Promise) {
//   return knex.schema.dropTable('papers');
// };
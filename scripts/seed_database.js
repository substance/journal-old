var db = require("../server/db");


db.seed(function(err) {
  if (err) return console.error(err);
  console.log('Database successfully seeded. Now run the server: `npm run start`');
  // Destroy db connection
  db.knex.destroy();
});
module.exports = function(knex) {

  var Document = {};

  // Create document schema
  // ------------
  // 
  // Drops table if exists

  Document.createSchema = function(cb) {
    knex.schema.dropTableIfExists('documents')
      .createTable('documents', function(table) {
        table.increments('id');
        table.boolean('published');
        table.json('data');
      })
      .then(function() {
        console.log('done creating Document schema.');
        cb(null);
      })
      .catch(cb);
  };

  // Create a new document
  // ------------
  // 

  Document.create = function(data, username, cb) {
    var jsonStr = JSON.stringify(data, null, "  ");
    knex.table('documents').insert({data: jsonStr})
      .then(function() { cb(null) })
      .catch(cb);
  };

  // Return all available docs
  // ------------
  // 
  // TODO: only return published docs

  Document.findAll = function(cb) {
    knex.select().table('documents')
      .then(function(result) { cb(null, result)})
      .catch(cb);
  };

  // Return all available docs
  // ------------
  // 

  Document.get = function(id, cb) {
    knex('documents').where('id', id)
      .then(function(result) { cb(null, result)})
      .catch(cb);
  };

  return Document;
};


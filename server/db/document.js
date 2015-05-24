var knex = require('./connect');
var _ = require('lodash');
var Document = exports;

// Create document schema
// ------------
// 
// Drops table if exists

Document.createSchema = function(cb) {
  knex.schema.dropTableIfExists('documents')
    .createTable('documents', function(table) {
      table.increments('id');
      table.string('creator');
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

Document.create = function(data, creator, cb) {
  var self = this;
  var jsonStr = JSON.stringify(data, null, "  ");
  knex.table('documents').insert({data: jsonStr, creator: creator })
    .asCallback(function(err, id) {
      if(err) return cb(err, 400, {});
      return self.get(id[0], cb);
    });
};

// Return all available docs
// ------------
// 
// TODO: only return published docs (when logged out) but all docs (when logged in)
// TODO: store title, abstract etc (stuff that should be shown in the dashboard)
// in the db table directly
// TODO Daniel: improve the creator object

Document.findAll = function(cb) {
  knex.select().table('documents')
    .asCallback(function(err, documents) {
      _.each(documents, function(doc) {
        var docData = JSON.parse(doc.data);
        delete doc.data;
        doc.title = docData.nodes["document"].title;
        doc.abstract = "provide abstract";
        doc.creator = {
          "username": doc.creator,
          // TODO: extract full name of creator and provide here
          "name": doc.creator
        }
      });

      if(err) return cb(err);
      return cb(null, documents);
    });
};

// Return all available docs
// ------------
// 

Document.get = function(id, cb) {
  knex('documents').where('id', id)
    .asCallback(function(err, item) {
      if(err) return cb(err, 400, {});
      return cb(null, 200, item[0])
    });
};

Document.update = function(id, data, user, cb) {
  var self = this;

  knex('documents').where('id', id).update(data)
    .asCallback(function(err, item) {
      if(err) return cb(err, 400, {});
      return self.get(id, cb);
    })
};

Document.remove = function(id, user, cb) {
  knex('documents').where('id', id).del()
    .asCallback(function(err) {
      if(err) return cb(err, 400, {});
      return cb(null, 200, {});
    });
};
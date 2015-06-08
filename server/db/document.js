var knex = require('./connect');
var _ = require('lodash');

var Document = exports;

// Document serializaton
// ------------
// 
// Takes a Substance document JSON and turns it into our SQL compatible
// representation
// 
// Then we can:
// 
// knex.table('documents').insert(serializeDocument(jsonDoc));

var serializeDocument = function(doc, creator) {
  // Make a deep clone of the source doc, that we will manipulate
  var docData = JSON.parse(JSON.stringify(doc));
  var docNodes = docData.nodes;

  // Here we will store all properties for the database row
  var docEntry = {};

  // Document ID
  // ----------------

  // We remove the document id from the docData to ensure that
  // there's no data redundancy
  delete docNodes.document.guid;

  // Creator
  // ----------------

  // Only if creator is explicitly provided (create doc) we store it
  if (creator) docEntry.creator = creator;
  delete docNodes.document.creator;

  // Doc Title
  // ----------------

  // Keep in mind we only store the plaintext of the title in the database.
  // Title annotations are still stored in the docData
  // This gives us most flexibility and a simple way to retrieve the title on the db
  // level without sneaking into the document's JSON
  docEntry.title = docNodes.document.title;
  delete docNodes.document.title;

  // Abstract
  // ----------------

  docEntry.abstract = docNodes.document.abstract;
  delete docNodes.document.abstract;

  // Publish Date
  // ----------------

  // published_on we store in db, so we can query for it
  // TODO: turn this into a UNIX timestamp
  docEntry.published_on = docNodes.document.published_on;
  delete docNodes.document.published_on;

  // Timestamps
  // ----------------
  // 

  // created_at can not be changed so we just remove it from docData
  delete docNodes.document.created_at;

  // TODO: just to make sure the client can not fake the updated_at date, we could just
  // use the current system timestamp here.
  docEntry.updated_at = docNodes.document.updated_at;
  delete docNodes.document.updated_at;

  docEntry.data = JSON.stringify(docData);

  return docEntry;
};


// Document serializaton
// ------------
// 
// Takes the SQL-Record representation and turns it into a Substance document
// 
// Use this in Document.get

var deserializeDocument = function(docEntry) {

  // We take the raw JSON data from the db row as a starting point
  var doc = JSON.parse(docEntry.data);

  // Document ID
  doc.nodes.document.guid = docEntry.id;

  // Creator
  doc.nodes.document.creator = {
    username: docEntry.creator,
    name: docEntry.fullname
  }

  // Doc Title
  doc.nodes.document.title = docEntry.title;

  // Abstract
  doc.nodes.document.abstract = docEntry.abstract;

  // Publish Date
  if (docEntry.published_on) {
    doc.nodes.document.published_on = new Date(docEntry.published_on);
  } else {
    doc.nodes.document.published_on = null;
  }

  // Timestamps
  doc.nodes.document.created_at = new Date(docEntry.created_at);
  doc.nodes.document.updated_at = new Date(docEntry.updated_at);

  return doc;
};



// Create document schema
// ------------
// 
// Drops table if exists

// Document.createSchema = function(cb) {
//   knex.schema.dropTableIfExists('documents')
//     .createTable('documents', function(table) {
//       table.increments('id');
//       table.string('creator');
//       table.string('title');
//       table.string('abstract');
//       table.date('published_on');
//       table.timestamps();
//       table.json('data');
//     })
//     .then(function() {
//       console.log('done creating Document schema.');
//       cb(null);
//     })
//     .catch(cb);
// };

// Create a new document
// ------------
// 

Document.create = function(doc, creator, cb) {
  var self = this;
  var docEntry = serializeDocument(doc, creator);
  knex.table('documents').insert(docEntry)
    .asCallback(function(err, ids) {
      if(err) return cb(err);
      cb(null, {
        id: ids[0],
        status: "Successfully created a new document"
      });
    });
};

// Return all available docs
// ------------
// 
// TODO: only return published docs (when logged out) but all docs (when logged in)
// TODO Daniel: improve the creator object

Document.find = function(options, cb) {

  var query = knex('documents')
                .join('users', {'documents.creator': 'users.username'})
                .select('documents.id', 'documents.title', 'documents.abstract', 'documents.creator', 'documents.updated_at', 'users.name as fullname');
  
  // Exclude all unpublished documents
  if(options.publishedOnly) {
    query.whereNotNull('published_on');
  }

  query.asCallback(function(err, documents) {
    _.each(documents, function(doc) {
      doc.creator = {
        "username": doc.creator,
        "name": doc.fullname
      };
      delete doc.fullname;
    });

    if(err) return cb(err);
    return cb(null, documents);
  });
};

// Return all available docs
// ------------
// 

Document.get = function(id, options, cb) {
  if (!id) {
    console.error('Document.get: no id provided');
    cb(new Error('no id provided'));
  }

  var query = knex('documents')
                .join('users', {'documents.creator': 'users.username'})
                .select('documents.id', 'documents.title', 'documents.abstract', 'documents.published_on', 'documents.created_at', 'documents.updated_at', 'documents.data', 'documents.creator', 'users.name as fullname')
                .where('documents.id', id);
  
  if(options.publishedOnly) {
    query.whereNotNull('published_on');
  }

  query.asCallback(function(err, documents) {
      if(err) return cb(err);

      if(_.isEmpty(documents)){
        return cb(new Error("Sorry, we didn't found anything interesting for you."));
      }

      var docEntry = documents[0];
      var doc = deserializeDocument(docEntry);
      return cb(null, doc);
    });
};

// TODO: In future check JSON if it conforms to a valid Substance document
Document.update = function(id, doc, username, cb) {
  var self = this;
  var docEntry = serializeDocument(doc, username);
  knex('documents').where('id', id).update(docEntry)
    .asCallback(function(err, id) {
      if(err) return cb(err);
      return cb(null, id);
    });
};


// Update Comments
// ------------
// 
// Uses Substance document change interface for describing updates
// Here's an example for a comment creation

// {
//   "ops": [
//     {
//       "type": "create",
//       "path": [
//         "remark8cba793d331d085a3b0205ee1536c7ce"
//       ],
//       "val": {
//         "id": "remark8cba793d331d085a3b0205ee1536c7ce",
//         "type": "remark",
//         "container": "content",
//         "content": "",
//         "startPath": [
//           "paragraph_1",
//           "content"
//         ],
//         "endPath": [
//           "paragraph_1",
//           "content"
//         ],
//         "startOffset": 286,
//         "endOffset": 305
//       }
//     }
//   ]
// }


Document.updateComments = function(id, doc, change, cb) {
  // TODO: implement
};

Document.remove = function(id, user, cb) {
  knex('documents').where('id', id).del()
    .asCallback(function(err) {
      if(err) return cb(err);
      return cb(null);
    });
};

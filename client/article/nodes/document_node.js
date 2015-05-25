var Substance = require('substance');

var DocumentNode = Substance.Document.Node.extend({
  name: "document",
  properties: {
    // globally unique document id (provided by system)
    "guid": "string",
    "creator": "string",
    "title": "string",
    "abstract": "string",
    "created_at": "date",
    "updated_at": "date",

    // When not null, it means the doc is published
    "published_on": "date",
  }
});

module.exports = DocumentNode;
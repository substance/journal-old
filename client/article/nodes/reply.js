var Substance = require("substance");

var Reply = Substance.Document.Node.extend({
  name: "reply",
  properties: {
    "content": "string",
    "creator": "string",
    "creator_name": "string",
    "created_at": "date"
  }
});

module.exports = Reply;

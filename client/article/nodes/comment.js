var ContainerAnnotation = require("substance").Document.ContainerAnnotation;

var Comment = ContainerAnnotation.extend({
  name: "comment",
  properties: {
    "content": "string",
    "creator": "string",
    "creator_name": "string",
    "created_at": "date",
    "replies": []
  },

  getReplies: function() {
    
  }
});

module.exports = Comment;

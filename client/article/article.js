"use strict";

var Substance = require("substance");
var Document = Substance.Document;
var _ = require("substance/helpers");

// Nodes
// --------------

var DocumentNode = require("./nodes/document_node");
var Paragraph = require("./nodes/paragraph");
var Heading = require("./nodes/heading");
var Emphasis = require("./nodes/emphasis");
var Strong = require("./nodes/strong");
var Comment = require("./nodes/comment");
var Reply = require("./nodes/reply");

var schema = new Document.Schema("substance-article", "1.0.0");
schema.addNodes([
  DocumentNode,
  Paragraph,
  Heading,
  Emphasis,
  Strong,
  Comment,
  Reply
]);

var Article = function(data) {
  Document.call(this, schema, data);

  this.commentsIndex = this.addIndex('commentsIndex', Substance.Data.Index.create({
    type: "comment",
    property: "id"
  }));
};

Article.Prototype = function() {

  this.getTOCNodes = function() {
    var tocNodes = [];
    var contentNodes = this.get('content').nodes;
    _.each(contentNodes, function(nodeId) {
      var node = this.get(nodeId);
      if (node.type === "heading") {
        tocNodes.push(node);
      }
    }, this);
    return tocNodes;
  };

};

Substance.inherit(Article, Document);
Article.schema = schema;
module.exports = Article;
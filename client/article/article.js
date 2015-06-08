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
var Remark = require("./nodes/remark");
var Comment = require("./nodes/comment");

var schema = new Document.Schema("substance-article", "1.0.0");
schema.addNodes([
  DocumentNode,
  Paragraph,
  Heading,
  Emphasis,
  Strong,
  Remark,
  Comment
]);

var Article = function(data) {
  Document.call(this, schema, data);

  this.remarksIndex = this.addIndex('remarksIndex', Substance.Data.Index.create({
    type: "remark",
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
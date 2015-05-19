"use strict";

var Substance = require('substance');
var Document = Substance.Document;

// Nodes
// --------------

var DocumentNode = require("./nodes/document_node");
var TextNode = require("./nodes/text_node");
var Emphasis = require("./nodes/emphasis");
var Strong = require("./nodes/strong");
var Remark = require("./nodes/remark");

var schema = new Document.Schema("substance-article", "1.0.0");
schema.addNodes([
  DocumentNode,
  TextNode,
  Emphasis,
  Strong,
  Remark
]);

var Article = function(data) {
  Document.call(this, schema, data);

  this.remarksIndex = this.addIndex('remarksIndex', Substance.Data.Index.create({
    type: "remark",
    property: "id"
  }));
};

Article.Prototype = function() {};

Substance.inherit(Article, Document);
Article.schema = schema;
module.exports = Article;
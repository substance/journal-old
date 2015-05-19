var Substance = require("substance");
var Article = require('../article');
var EXAMPLE_DOC = require("../../data/sample_doc");
var _ = require("substance/helpers");

var Backend = function(opts) {

};

Backend.Prototype = function() {

  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    var doc = new Article(EXAMPLE_DOC);
    window.doc = doc;
    cb(null, doc);
  };

  this.saveDocument = function(doc, cb) {
    cb(new Error("Saving not supported in dev mode"));
  };
};

Substance.initClass(Backend);

module.exports = Backend;
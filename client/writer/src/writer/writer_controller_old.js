"use strict";

var Substance = require('substance');
var Document = Substance.Document;
var Selection = Document.Selection;
var _ = require("substance/helpers");
var ToolManager = require("substance").Surface.ToolManager;

var Highlight = require("./components/text_property").Highlight;

// Writer Controller
// ----------------
//
// An common interface for all writer modules

var WriterController = function(opts) {
  // Substance.EventEmitter.call(this);

  // this.config = opts.config;
  // this.doc = opts.doc;
  // this.writerComponent = opts.writerComponent;
  // this.surfaces = {};

  // this.doc.connect(this, {
  //   'transaction:started': this.transactionStarted,
  //   'document:changed': this.onDocumentChanged
  // });

  // this.toolManager = new ToolManager(this.doc, {
  //   isToolEnabled: this.isToolEnabled.bind(this)
  // });

  // this.extensionManager = new ExtensionManager(opts.extensions);

};

WriterController.Prototype = function() {

  // API method used by writer modules to modify the writer state
  // this.replaceState = function(newState, cb) {
  //   this.writerComponent.replaceState(newState, cb);
  // };

  // this.transactionStarted = function(tx) {
  //   // store the state so that it can be recovered when undo/redo
  //   tx.before.state = this.writerComponent.state;
  //   tx.before.selection = this.getSelection();
  //   if (this.activeSurface) {
  //     tx.before.surfaceName = this.activeSurface.name;
  //   }
  // };

  // this.onDocumentChanged = function(change, info) {
  //   this.doc.__dirty = true;
  //   var notifications = this.writerComponent.context.notifications;

  //   notifications.addMessage({
  //     type: "info",
  //     message: "Unsaved changes"
  //   });

  //   // This is the undo/redo case
  //   if (info.replay) {
  //     this.replaceState(change.after.state);
  //     var self = this;
  //     window.setTimeout(function() {
  //       if (change.after.surfaceName) {
  //         var surface = self.surfaces[change.after.surfaceName];
  //         surface.setSelection(change.after.selection);
  //       }
  //     });
  //   }
  // };


};

Substance.inherit(WriterController, Substance.EventEmitter);

Object.defineProperty(WriterController.prototype, 'state', {
  get: function() {
    return this.writerComponent.state;
  },
  set: function() {
    throw new Error("Immutable property. Use replaceState");
  }
});


module.exports = WriterController;
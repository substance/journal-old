"use strict";

var Substance = require('substance');
var _ = require("substance/helpers");

var ExtensionManager = function(extensions, writer) {
  this.extensions = extensions;
  this.writer = writer;
};

ExtensionManager.Prototype = function() {

  // Get all available extensions
  this.getExtensions = function() {
    return this.extensions;
  };

  // Get all available tools from core and extensions
  this.getTools = function() {
    var extensions = this.extensions;
    var tools = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      if (ext.tools) {
        tools = tools.concat(ext.tools);
      }
    }
    return tools;
  };

  this.getPanels = function() {
    var extensions = this.extensions;
    var panels = [];

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];
      panels = panels.concat(ext.panels);
    }
    return panels;
  };

  // Generic function to call a state handler
  // ---------------

  this.handle = function(handlerName) {
    var result = null;
    var extensions = this.extensions;

    for (var i = 0; i < extensions.length && !result; i++) {
      var stateHandlers = extensions[i].stateHandlers;
      if (stateHandlers && stateHandlers[handlerName]) {
        result = stateHandlers[handlerName](this.writer, arguments[1], arguments[2]); // .handleContextPanelCreation(this)
      }
    }
    return result;
  };


  this.handleSelectionChange = function(sel) {
    return this.handle("handleSelectionChange", sel);
  };

  this.getActivePanelElement = function() {
    var activePanel = this.handle("handleContextPanelCreation");
    return activePanel || [];
  };

  // Based on a certain writer state, determine which nodes
  // should be highlighted in the scrollbar and in the document
  this.getHighlightedNodes = function() {
    var highlightedNodes = this.handle("getHighlightedNodes");
    return highlightedNodes || [];
  };

  // Desired implementation
  this.getActiveContainerAnnotations = function() {
    var activeContainerAnnotations = this.handle('getActiveContainerAnnotations');
    return activeContainerAnnotations || [];
  };

};

Substance.initClass(ExtensionManager);

module.exports = ExtensionManager;

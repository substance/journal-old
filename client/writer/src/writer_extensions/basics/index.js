"use strict";

var stateHandlers = require("./state_handlers");
var ContentEditor = require("./content_editor");
var TOCPanel = require("./toc_panel");

module.exports = {
  components: {
    "container": ContentEditor,
  },
  name: "basics",
  panels: [
    TOCPanel
  ],
  stateHandlers: stateHandlers,
  tools: []
}; 

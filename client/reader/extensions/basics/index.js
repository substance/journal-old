"use strict";

var stateHandlers = require("./state_handlers");

// Components
var ContentEditor = require("./content_editor");
var Heading = require("./heading");
var Paragraph = require("./paragraph");

// Panels
var TOCPanel = require("./toc_panel");

module.exports = {
  components: {
    "container": ContentEditor,
    "heading": Heading,
    "paragraph": Paragraph
  },
  name: "basics",
  panels: [
    TOCPanel
  ],
  stateHandlers: stateHandlers,
  tools: []
};

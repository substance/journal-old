"use strict";

var stateHandlers = require("./state_handlers");

// Components
var ContentEditor = require("./content_editor");
var Heading = require("./heading");
var Paragraph = require("./paragraph");

// Tools
var PublishTool = require("./tools/publish_tool");
var EmphasisTool = require("./tools/emphasis_tool");
var StrongTool = require("./tools/strong_tool");

// Panels
var TOCPanel = require("substance-ui/toc_panel");

module.exports = {
  components: {
    "content_container": ContentEditor,
    "heading": Heading,
    "paragraph": Paragraph
  },
  name: "basics",
  panels: [
    TOCPanel
  ],
  stateHandlers: stateHandlers,
  tools: [
    PublishTool,
    EmphasisTool,
    StrongTool
  ]
};

"use strict";

var stateHandlers = require("./state_handlers");

// Components
var ContentContainer = require("./content_container");
var Heading = require("./heading");
var Paragraph = require("./paragraph");
var SaveTool = require("substance-ui/writer/tools/save_tool");

// Panels
var TOCPanel = require("substance-ui/toc_panel");

module.exports = {
  components: {
    "content_container": ContentContainer,
    "heading": Heading,
    "paragraph": Paragraph
  },
  name: "basics",
  panels: [
    TOCPanel
  ],
  stateHandlers: stateHandlers,
  tools: [
    SaveTool
  ]
};

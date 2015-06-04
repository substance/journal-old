"use strict";

var stateHandlers = require("./state_handlers");

// Components
var ContentContainer = require("./content_container");
var Heading = require("./heading");
var Paragraph = require("./paragraph");


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
  tools: []
};

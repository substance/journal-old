var RemarksPanel = require("./remarks_panel");
var RemarkTool = require("./remark_tool");
var stateHandlers = require("./state_handlers");

module.exports = {
  name: "subjects",
  panels: [
    RemarksPanel
  ],
  stateHandlers: stateHandlers,
  tools: [
    RemarkTool
  ]
};

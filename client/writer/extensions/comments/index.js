var CommentsPanel = require("./comments_panel");
var CommentTool = require("./comment_tool");
var stateHandlers = require("./state_handlers");

module.exports = {
  name: "comments",
  panels: [
    CommentsPanel
  ],
  stateHandlers: stateHandlers,
  tools: [
    CommentTool
  ]
};

'use strict';

var Substance = require('substance');
var _ = require('substance/helpers');
var $$ = React.createElement;

var AnnotationToolMixin = require("substance-ui/annotation_tool_mixin");

var CommentToolMixin = _.extend({}, AnnotationToolMixin, {
  getAnnotationData: function() {
    return {
      container: "content",
      content: ""
    }
  },
  disabledModes: ["remove", "fusion"],
  afterCreate: function(anno) {
    var app = this.context.app;
    app.replaceState({
      contextId: "comments",
      commentId: anno.id
    });
  }
});

var CommentTool = React.createClass({
  mixins: [CommentToolMixin],
  displayName: "CommentTool",
  title: "comment",
  annotationType: "comment",
  toolIcon: "fa-comment",
});

module.exports = CommentTool;


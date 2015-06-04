'use strict';

var Substance = require('substance');
var _ = require('substance/helpers');
var $$ = React.createElement;

var AnnotationToolMixin = require("substance-ui/annotation_tool_mixin");

var RemarkToolMixin = _.extend({}, AnnotationToolMixin, {
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
      contextId: "remarks",
      remarkId: anno.id
    });
  }
});

var RemarkTool = React.createClass({
  mixins: [RemarkToolMixin],
  displayName: "RemarkTool",
  title: "Remark",
  annotationType: "remark",
  toolIcon: "fa-comment",
});

module.exports = RemarkTool;


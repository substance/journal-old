var $$ = React.createElement;
var Substance = require("substance");
var Surface = Substance.Surface;
var _ = require("substance/helpers");

var PanelMixin = require("substance-ui/panel_mixin");

// Sub component
var Comment = require("./comment");

// Subjects Panel extension
// ----------------

var CommentsPanelMixin = _.extend({}, PanelMixin, {

  // State relevant things
  // ------------

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    surface: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  componentWillMount: function() {
    var app = this.context.app;
    var surface = new Surface(new Surface.FormEditor(app.doc));

    surface.connect(this, {
      'selection:changed': function(sel) {
        var currentCommentId;
        if (this.props.activeComment) {
          currentCommentId = this.props.activeComment.id;
        }
        
        if (!sel.getPath) return; // probably a null selection
        var commentId = sel.getPath()[0];
        if (commentId !== currentCommentId) {
          app.replaceState({
            contextId: "comments",
            commentId: commentId,
            noScroll: true
          });
          surface.rerenderDomSelection();          
        }
      }
    });

    this.surface = surface;
    return {};
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.registerSurface(this.surface, "comments", {
      enabledTools: ["strong", "emphasis"]
    });
    this.surface.attach(this.getDOMNode());
    this.updateScroll();
  },

  componentDidUpdate: function() {
    this.updateScroll();
  },

  updateScroll: function() {
    var app = this.context.app;
    if (this.props.activeComment && !app.state.noScroll) {
      this.scrollToNode(this.props.activeComment.id);
    }
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.unregisterSurface(this.surface);
    this.surface.detach();
  },

  // Rendering
  // -------------------

  render: function() {
    var state = this.state;
    var props = this.props;
    var self = this;

    var commentNodes = this.props.comments.map(function(comment) {
      return $$(Comment, {
        comment: comment,
        key: comment.id,
        active: comment === props.activeComment,
      });
    });

    return $$("div", {className: "panel comments-panel-component", contentEditable: true, 'data-id': "comments"},
      $$('div', {className: 'panel-content', ref: "panelContent"},
        $$('div', {className: 'panel-content-inner comments'},
          commentNodes
        )
      )
    );
  }
});


var CommentsPanel = React.createClass({
  mixins: [CommentsPanelMixin],
  displayName: "Comments",
});

// Panel Configuration
// -----------------

CommentsPanel.contextId = "comments";
CommentsPanel.icon = "fa-comment";

module.exports = CommentsPanel;
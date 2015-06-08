var CommentsPanel = require("./comments_panel");
var $$ = React.createElement;
var Substance = require("substance");
var _ = require("substance/helpers");

var stateHandlers = {

  // Handle Context Panel creation
  // -----------------
  //
  // => inspects state
  //
  // Returns a new panel element if a particular state is matched

  handleContextPanelCreation: function(app) {
    var s = app.state;
    var doc = app.doc;

    var comments = _.map(doc.commentsIndex.get(), function(comment) {
      return comment;
    });

    if (s.contextId === CommentsPanel.contextId) {
      var activeComment;
      if (s.commentId) {
        activeComment = doc.get(s.commentId);
      }

      return $$(CommentsPanel, {
        comments: comments,
        activeComment: activeComment
      });
    }
  },

  // Reader triggers this
  handleAnnotationToggle: function(app, annotationId) {
    var doc = app.doc;
    var state = app.state;
    var anno = doc.get(annotationId);

    if (anno.type === "comment") {
      if (app.state.commentId === anno.id) {
        app.replaceState({
          contextId: CommentsPanel.contextId
        });
      } else {
        app.replaceState({
          contextId: CommentsPanel.contextId,
          commentId: anno.id
        });

      }
    }
    return true;
  },

  // Writer triggers this
  handleSelectionChange: function(app, sel, annotations) {
    if (sel.isNull() || !sel.isCollapsed()) return;
    
    var surface = app.getSurface();
    if (surface.name !== "content") return false;

    var doc = app.doc;
    var contentContainer = surface.getContainer();

    var annos = doc.getContainerAnnotationsForSelection(sel, contentContainer, {
      type: "comment"
    });

    var activeComment = annos[0];
    if (activeComment) {
      app.replaceState({
        contextId: CommentsPanel.contextId,
        commentId: activeComment.id
      });

      return true;
    }
  },

  // Determine highlighted nodes
  // -----------------
  //
  // => inspects state
  //
  // Based on app state, determine which nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getHighlightedNodes: function(app) {
    var doc = app.doc;
    var state = app.state;

    // When a subject has been clicked in the subjects panel
    if (state.contextId === "comments" && state.commentId) {
      return [state.commentId];
    }
  },

  // Determine active subject reference nodes
  // -----------------
  //
  // => inspects state
  //
  // Based on app state, determine which container nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getActiveContainerAnnotations: function(app) {
    var state = app.state;
    var doc = app.doc;
    var comments = Object.keys(doc.commentsIndex.get());      
    return comments;
  }
};

module.exports = stateHandlers;
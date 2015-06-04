var $$ = React.createElement;

var TOCPanel = require("./toc_panel");

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

    if (s.contextId === TOCPanel.contextId) {
      return $$(TOCPanel, {
        doc: app.doc // TODO pass headings in chronological order
      });
    }
  },

  // handleSelectionChange: function(app, sel) {
  //   var surface = app.getSurface();
  //   if (surface.name !== "content") return;

  //   if (sel.isNull() || !sel.isCollapsed()) return;

  //   var annotations = app.doc.annotationIndex.get(sel.getPath(), sel.getStartOffset(), sel.getEndOffset(), "reference");

  //   console.log('annos');

  //   // Switch to a neutral state if no annotation matches have been found
  //   if (annotations.length === 0) {
  //     var nextContextId = "toc";

  //     app.replaceState({
  //       contextId: nextContextId
  //     });
  //     return true;
  //   }
  // }
};

module.exports = stateHandlers;
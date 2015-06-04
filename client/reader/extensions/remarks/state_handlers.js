var RemarksPanel = require("./remarks_panel");
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

    var remarks = _.map(doc.remarksIndex.get(), function(remark) {
      return remark;
    });

    if (s.contextId === RemarksPanel.contextId) {
      var activeRemark;
      if (s.remarkId) {
        activeRemark = doc.get(s.remarkId);
      }

      return $$(RemarksPanel, {
        remarks: remarks,
        activeRemark: activeRemark
      });
    }
  },

  handleAnnotationToggle: function(app, annotationId) {
    console.log('handling annotation toggle for remarks', annotationId);
    return true;
  },

  // handleSelectionChange: function(app, sel, annotations) {
  //   if (sel.isNull() || !sel.isCollapsed()) return;
    
  //   var surface = app.getSurface();
  //   if (surface.name !== "content") return false;

  //   var doc = app.doc;
  //   var contentContainer = surface.getContainer();

  //   var annos = doc.getContainerAnnotationsForSelection(sel, contentContainer, {
  //     type: "remark"
  //   });

  //   var activeRemark = annos[0];
  //   if (activeRemark) {
  //     app.replaceState({
  //       contextId: RemarksPanel.contextId,
  //       remarkId: activeRemark.id
  //     });

  //     return true;
  //   }
  // },

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
    if (state.contextId === "remarks" && state.remarkId) {
      return [state.remarkId];
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
    var remarks = Object.keys(doc.remarksIndex.get());      
    return remarks;
  }
};

module.exports = stateHandlers;
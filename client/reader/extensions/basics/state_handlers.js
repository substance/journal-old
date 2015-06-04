var $$ = React.createElement;

var TOCPanel = require("substance-ui/toc_panel");

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
  }

};

module.exports = stateHandlers;
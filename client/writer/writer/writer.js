/* global $ */
var $$ = React.createElement;

var Substance = require("substance");
var _ = require("substance/helpers");
var ContentTools = require("./content_tools");
var ContentPanel = require("./content_panel");
var WriterController = require("./writer_controller");
var StatusBar = require("./status_bar");

// The Substance Writer Component
// ----------------

var WriterMixin = _.extend({}, WriterController.prototype, Substance.EventEmitter.prototype, {
  contextTypes: {
    backend: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired,
    htmlImporter: React.PropTypes.object.isRequired,
    htmlExporter: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    // used by text properties to render 'active' annotations
    // For active container annotations annotation fragments are inserted
    // which can be used to highlight the associated range
    app: React.PropTypes.object,
    getHighlightedNodes: React.PropTypes.func,
    getHighlightsForTextProperty: React.PropTypes.func
  },

  getChildContext: function() {
    var context = {
      app: this,
      getHighlightedNodes: this.getHighlightedNodes,
      getHighlightsForTextProperty: this.getHighlightsForTextProperty,
    };
    // console.log('context', context);
    return context;
  },

  getInitialState: function() {
    return {"contextId": "toc"};
  },

  // Internal methods
  // ----------------

  getDocument: function() {
    return this.props.doc;
  },

  getConfig: function() {
    return this.props.config;
  },

  // Events
  // ----------------

  componentWillMount: function() {
    this._initializeController();
  },

  componentWillUnmount: function() {
    this.clipboard.detach(this.getDOMNode());
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var sprevState = JSON.stringify(this.state);
    var snextState = JSON.stringify(nextState);
    if (Substance.isEqual(sprevState, snextState)) {
      return false;
    }
    return true;
  },

  componentDidMount: function() {
    // if (!window.devMode) {
    //   setInterval(function() {
    //     this.requestAutoSave();
    //   }.bind(this), 10000);
    // }
    var rootElement = this.getDOMNode();
    var $clipboard = $(rootElement).find('.clipboard');
    this.clipboard = new Substance.Surface.Clipboard(this, $clipboard[0],
      this.context.htmlImporter, this.context.htmlExporter);
    this.clipboard.attach(rootElement);
  },


  // E.g. when a tool requests a context switch
  handleContextSwitch: function(contextId) {
    this.replaceState({
      contextId: contextId
    });
  },

  handleCloseDialog: function(e) {
    e.preventDefault();
    console.log('handling close');
    this.replaceState(this.getInitialState());
  },

  // Triggered by Writer UI
  handleContextToggle: function(e) {
    e.preventDefault();
    var newContext = $(e.currentTarget).attr("data-id");
    this.handleContextSwitch(newContext);
  },

  // Rendering
  // ----------------

  // Toggles for explicitly switching between context panels
  createContextToggles: function() {
    var panels = this.getPanels();

    var contextId = this.state.contextId;
    var self = this;

    var panelComps = panels.map(function(panelClass) {
      // We don't show inactive stuff here
      if (panelClass.isDialog && panelClass.contextId !== contextId) return null;

      var className = ["toggle-context"];
      if (panelClass.contextId === contextId) {
        className.push("active");
      }

      if (panelClass.isDialog) {
        return $$('div');
      } else {
        return $$('a', {
          className: className.join(" "),
          href: "#",
          key: panelClass.contextId,
          "data-id": panelClass.contextId,
          onClick: self.handleContextToggle,
          dangerouslySetInnerHTML: {__html: '<i class="fa '+panelClass.icon+'"></i> '+panelClass.displayName}
        });
      }
    });

    return $$('div', {className: "context-toggles"},
      Substance.compact(panelComps)
    );
  },

  // Create a new panel based on current writer state (contextId)
  createContextPanel: function() {
    var panelElement = this.getActivePanelElement();
    if (!panelElement) {
      return $$('div', null, "No panels are registered");
    }
    return panelElement;
  },

  render: function() {
    return $$('div', { className: 'writer-component', onKeyDown: this.handleApplicationKeyCombos},
      $$('div', {className: "main-container"},
        $$(ContentTools),
        $$(ContentPanel)
      ),
      $$('div', {className: "resource-container"},
        this.createContextToggles(),
        this.createContextPanel(this)
      ),
      $$(StatusBar, {
        doc: this.props.doc
      }),
      $$('div', {className: "clipboard"})
    );
  },

  // return true when you handled a key combo
  handleApplicationKeyCombos: function(e) {
    // console.log('####', e.keyCode, e.metaKey, e.ctrlKey, e.shiftKey);
    var handled = false;
    // TODO: we could make this configurable via extensions
    // Undo/Redo: cmd+z, cmd+shift+z
    if (e.keyCode === 90 && (e.metaKey||e.ctrlKey)) {
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      handled = true;
    }
    // Reset to default state
    else if (e.keyCode === 27) {
      this.replaceState(this.getInitialState());
      handled = true;
    }
    // Save: cmd+s
    else if (e.keyCode === 83 && (e.metaKey||e.ctrlKey)) {
      this.requestSave();
      handled = true;
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});

// Create React class

var Writer = React.createClass({
  mixins: [WriterMixin],
  displayName: "Writer",
});

module.exports = Writer;
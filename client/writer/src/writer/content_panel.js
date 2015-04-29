var $$ = React.createElement;
var Substance = require("substance");
var Scrollbar = require("./scrollbar");
var _ = require("substance/helpers");
var PanelMixin = require("./panel_mixin");

var ContentPanelMixin = _.extend({}, PanelMixin, {

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    componentFactory: React.PropTypes.object.isRequired,
  },

  // Since component gets rendered multiple times we need to update
  // the scrollbar and reattach the scroll event
  componentDidMount: function() {
    var app = this.context.app;
    this.updateScrollbar();
    $(window).on('resize', this.updateScrollbar);

    var doc = app.doc;
    doc.connect(this, {
      'document:changed': this.onDocumentChange
    });
  },

  componentWillUnmount: function() {
    var app = this.context.app
    var doc = app.doc;
    doc.disconnect(this);
    $(window).off('resize');
  },

  onDocumentChange: function() {
    setTimeout(function() {
      this.updateScrollbar();
    }.bind(this), 0);
  },

  componentDidUpdate: function() {
    this.updateScrollbar();
  },

  updateScrollbar: function() {
    var scrollbar = this.refs.scrollbar;
    var panelContentEl = this.refs.panelContent.getDOMNode();

    // We need to await next repaint, otherwise dimensions will be wrong
    Substance.delay(function() {
      scrollbar.update(panelContentEl);  
    },0);

    // (Re)-Bind scroll event on new panelContentEl
    $(panelContentEl).off('scroll');
    $(panelContentEl).on('scroll', this._onScroll);
  },

  _onScroll: function(e) {
    var panelContentEl = this.refs.panelContent.getDOMNode();
    this.refs.scrollbar.update(panelContentEl);
  },

  // Rendering
  // -----------------

  getContentEditor: function() {
    var app = this.context.app;
    var doc = app.doc;

    var componentFactory = this.context.componentFactory;
    var ContainerClass = componentFactory.get("container");

    return $$(ContainerClass, {
      doc: doc,
      node: doc.get("content"),
      ref: "contentEditor"
    });
  },

  render: function() {
    var app = this.context.app;

    return $$("div", {className: "panel content-panel-component"}, // usually absolutely positioned
      $$(Scrollbar, {
        id: "content-scrollbar",
        contextId: app.state.contextId,
        highlights: app.getHighlightedNodes.bind(app),
        ref: "scrollbar"
      }),

      $$('div', {className: "panel-content", ref: "panelContent"}, // requires absolute positioning, overflow=auto
        this.getContentEditor()
      )
    );
  }
});

var ContentPanel = React.createClass({
  mixins: [ContentPanelMixin],
  displayName: "ContentPanel",
});

module.exports = ContentPanel;
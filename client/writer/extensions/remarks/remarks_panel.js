var $$ = React.createElement;
var Substance = require("substance");
var Surface = Substance.Surface;
var _ = require("substance/helpers");
var PanelMixin = require("../../writer").PanelMixin;

// Sub component
var Remark = require("./remark");

// Subjects Panel extension
// ----------------

var RemarksPanelMixin = _.extend({}, PanelMixin, {

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
        var currentRemarkId;
        if (this.props.activeRemark) {
          currentRemarkId = this.props.activeRemark.id;
        }
        
        if (!sel.getPath) return; // probably a null selection
        var remarkId = sel.getPath()[0];
        if (remarkId !== currentRemarkId) {
          app.replaceState({
            contextId: "remarks",
            remarkId: remarkId,
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
    app.registerSurface(this.surface, "remarks", {
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
    if (this.props.activeRemark && !app.state.noScroll) {
      this.scrollToNode(this.props.activeRemark.id);
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

    var remarkNodes = this.props.remarks.map(function(remark) {
      return $$(Remark, {
        remark: remark,
        key: remark.id,
        active: remark === props.activeRemark,
      });
    });

    return $$("div", {className: "panel remarks-panel-component", contentEditable: true, 'data-id': "remarks"},
      $$('div', {className: 'panel-content', ref: "panelContent"},
        $$('div', {className: 'panel-content-inner remarks'},
          remarkNodes
        )
      )
    );
  }
});


var RemarksPanel = React.createClass({
  mixins: [RemarksPanelMixin],
  displayName: "Remarks",
});

// Panel Configuration
// -----------------

RemarksPanel.contextId = "remarks";
RemarksPanel.icon = "fa-comment";

module.exports = RemarksPanel;
var $$ = React.createElement;
var Substance = require("substance");
var Surface = Substance.Surface;
var _ = require("substance/helpers");
var PanelMixin = require("../../writer").PanelMixin;

// Subjects Panel extension
// ----------------

var TOCPanelMixin = _.extend({}, PanelMixin, {

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
    return {};
  },

  componentDidMount: function() {
    // var app = this.context.app;
    // this.updateScroll();
  },

  componentDidUpdate: function() {
    // this.updateScroll();
  },

  updateScroll: function() {
    // var app = this.context.app;
    // if (this.props.activeRemark && !app.state.noScroll) {
    //   this.scrollToNode(this.props.activeRemark.id);
    // }
  },

  componentWillUnmount: function() {

  },

  // Rendering
  // -------------------

  render: function() {
    var state = this.state;
    var props = this.props;
    var self = this;

    // var headingNodes = this.props.remarks.map(function(remark) {
    //   return $$(Remark, {
    //     remark: remark,
    //     key: remark.id,
    //     active: remark === props.activeRemark,
    //   });
    // });
  
    console.log('YAY');
    return $$("div", {className: "panel toc-panel-component"}, "TABLE OF CONTENT COMES HERE");
  }
});

var TOCPanel = React.createClass({
  mixins: [TOCPanelMixin],
  displayName: "TOC",
});

// Panel Configuration
// -----------------

TOCPanel.contextId = "toc";
TOCPanel.icon = "fa-comment";

module.exports = TOCPanel;
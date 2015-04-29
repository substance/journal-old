var $$ = React.createElement;
var Substance = require("substance");

// Invariant: basic annotations can not overlap like there can not be two
// strong annotations for a particular range

var AnnotationToolMixin = Substance.extend({}, Substance.Surface.AnnotationTool.prototype, {

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      active: false,
      selected: false
    };
  },

  render: function() {
    var classNames = [this.annotationType+'-tool-component', 'tool'];
    if (this.state.active) classNames.push("active");
    if (this.state.selected) classNames.push("selected");
    return $$("a", {
      className: classNames.join(' '),
      href: "#",
      title: this.title,
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClick,
      dangerouslySetInnerHTML: {__html: '<i class="fa '+this.toolIcon+'"></i>'}
    });
  },

  componentWillMount: function() {
    var app = this.context.app;
    var toolManager = app.toolManager;
    toolManager.registerTool(this, this.annotationType);
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    var toolManager = app.toolManager;
    toolManager.unregisterTool(this);
  },

  getDocument: function() {
    var app = this.context.app;
    return app.doc;
  },

  getContainer: function() {
    var app = this.context.app;
    var surface = app.getSurface();
    return surface.getContainer();
  },

  getToolState: function() {
    return this.state;
  },

  setToolState: function(newState) {
    return this.replaceState(newState);
  },

  getAnnotationType: function() {
    return this.annotationType;
  },

  handleClick: function(e) {
    e.preventDefault(e);
  },

  handleMouseDown: function(e) {
    e.preventDefault();
    this.performAction();
  }

});

module.exports = AnnotationToolMixin;

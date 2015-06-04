var $$ = React.createElement;
var Substance = require("substance");
var Surface = Substance.Surface;
var TextProperty = require("substance-ui/text_property");

// TODO: We don't really need this in the reader

var DocumentTitle = React.createClass({
  displayName: "DocumentTitle",

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
    this.surface = new Surface(new Surface.FormEditor(app.doc));
    return {};
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.registerSurface(this.surface, "document-title");
    this.surface.attach(this.getDOMNode());
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.unregisterSurface(this.surface);
    this.surface.detach();
  },

  // Rendering
  // -------------------

  render: function() {
    var app = this.context.app;

    return $$("div", {className: "document-title", "data-id": "document-title"},
      $$(TextProperty, {
        doc: app.doc,
        tagName: "div",
        className: "title",
        path: ["document", "title"]
      })
    );
  }
});

module.exports = DocumentTitle;
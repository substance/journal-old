var Substance = require('substance');
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require("substance/helpers");

var TextProperty = require("substance-ui/text_property");
var DocumentTitle = require("./document_title");

// Container Node
// ----------------
//
// Represents a flat collection of nodes

var ContentContainer = React.createClass({
  displayName: "ContentContainer",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    componentFactory: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    // provided to editor components so that they know in which context they are
    surface: React.PropTypes.object,
  },

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  // TODO: provide "Surface.ContainerAnnotator" instead of editor?
  getInitialState: function() {
    var editor = new Surface.ContainerEditor(this.props.doc.get('content'));
    editor.defaultTextType = 'paragraph';
    var options = {
      logger: this.context.notifications
    };
    this.surface = new Surface(editor, options);
    return {};
  },

  render: function() {
    var containerNode = this.props.node;
    var doc = this.props.doc;
    var app = this.context.app;

    // Prepare container components (aka nodes)
    // ---------

    var componentFactory = this.context.componentFactory;
    var components = [];
    components = components.concat(containerNode.nodes.map(function(nodeId) {
      var node = doc.get(nodeId);
      var ComponentClass = componentFactory.get(node.type);
      if (!ComponentClass) {
        throw new Error('Could not resolve a component for type: ' + node.type);
      }
      return $$(ComponentClass, {
        key: node.id,
        doc: doc,
        node: node
      });
    }));

    // Top level structure
    // ---------

    return $$('div', {className: 'panel-content-inner'},
      $$(DocumentTitle),
      // The full fledged document (ContainerEditor)
      $$("div", {ref: "documentContent", className: "document-content", contentEditable: true, "data-id": "content"},
        $$("div", {
            className: "container-node " + this.props.node.id,
            spellCheck: false,
            "data-id": this.props.node.id
          },
          $$('div', {className: "nodes"}, components)
        )
      )
    );
  },

  componentDidMount: function() {
    var surface = this.surface;
    var app = this.context.app;
    var doc = this.props.doc;

    doc.connect(this, {
      'document:changed': this.onDocumentChange
    });

    app.registerSurface(surface, "content", {
    });
    surface.attach(this.refs.documentContent.getDOMNode());

    doc.connect(this, {
      'container-annotation-update': this.handleContainerAnnotationUpdate
    });

    var self = this;

    this.forceUpdate(function() {
      self.surface.rerenderDomSelection();
    });
  },

  handleContainerAnnotationUpdate: function() {
  },

  componentDidUpdate: function() {
    // HACK: when the state is changed this and particularly TextProperties
    // get rerendered (e.g., as the highlights might have changed)
    // Unfortunately we loose the DOM selection then.
    // Thus, we are resetting it here, but(!) delayed as otherwise the surface itself
    // might not have finished setting the selection to the desired and a proper state.
    var self = this;
    setTimeout(function() {
      self.surface.rerenderDomSelection();
    });
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    var surface = this.surface;
    var doc = this.props.doc;
    doc.disconnect(this);

    app.unregisterSurface(surface);
    surface.detach();
  },

  onDocumentChange: function(change) {
    var app = this.context.app;

    // Re-render 
    if (change.isAffected([this.props.node.id, 'nodes'])) {
      var self = this;
      this.forceUpdate(function() {
      });
    }
  }

});

module.exports = ContentContainer;
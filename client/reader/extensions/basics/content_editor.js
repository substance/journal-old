var Substance = require('substance');
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require("substance/helpers");

var TextProperty = require("substance-ui/text_property");
var TitleEditor = require("./title_editor");

var ENABLED_TOOLS = []; // ["strong", "emphasis", "remark", "text"];

// Container Node
// ----------------
//
// Represents a flat collection of nodes

var ContentEditor = React.createClass({
  displayName: "ContentEditor",

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

  getInitialState: function() {
    var editor = new Surface.ContainerEditor(this.props.doc.get('content'));
    // HACK: this is also Archivist specific
    editor.defaultTextType = 'paragraph';
    var options = {
      logger: this.context.notifications
      // scrollable: 
    };
    this.surface = new Surface(editor, options);

    return {};
  },

  handleToggleSubjectReference: function(e) {
    e.preventDefault();
    var subjectReferenceId = e.currentTarget.dataset.id;
    var app = this.context.app;
    var state = app.state;

    if (state.contextId === "editSubjectReference" && state.subjectReferenceId === subjectReferenceId) {
      app.replaceState({
        contextId: "subjects"
      });
    } else {
      app.replaceState({
        contextId: "editSubjectReference",
        subjectReferenceId: subjectReferenceId
      });
    }
  },

  render: function() {
    var containerNode = this.props.node;
    var doc = this.props.doc;
    var app = this.context.app;

    // Prepare subject reference components
    // ---------

    var subjectReferences = doc.getIndex('type').get('subject_reference');
    var subjectRefComponents = [];
    var activeContainerAnnotations = app.getActiveContainerAnnotations();

    _.each(subjectReferences, function(sref) {
      subjectRefComponents.push($$('a', {
        className: "subject-reference"+(_.includes(activeContainerAnnotations, sref.id) ? ' selected' : ''),
        href: "#",
        "data-id": sref.id,
        onClick: this.handleToggleSubjectReference
      }));
    }, this);

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
      $$(TitleEditor),
      // The full fledged interview (ContainerEditor)
      $$("div", {ref: "interviewContent", className: "interview-content", contentEditable: true, "data-id": "content"},
        $$("div", {
            className: "container-node " + this.props.node.id,
            spellCheck: false,
            "data-id": this.props.node.id
          },
          $$('div', {className: "nodes"}, components),
          $$('div', {className: "subject-references", contentEditable: false}, subjectRefComponents)
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
      enabledTools: ENABLED_TOOLS
    });
    surface.attach(this.refs.interviewContent.getDOMNode());

    doc.connect(this, {
      'container-annotation-update': this.handleContainerAnnotationUpdate
    });

    var self = this;

    this.forceUpdate(function() {
      self.surface.rerenderDomSelection();
    });

  },

  handleContainerAnnotationUpdate: function() {
    var self = this;
    this.forceUpdate(function() {
    });
  },

  componentDidUpdate: function() {
    // HACK: when the state is changed this and particularly TextProperties
    // get rerendered (e.g., as the highlights might have changed)
    // Unfortunately we loose the DOM selection then.
    // Thus, we are resetting it here, but(!) delayed as otherwise the surface itself
    // might not have finished setting the selection to the desired and a proper state.
    if (!this.surface.__prerendering__) {
      var self = this;
      setTimeout(function() {
        self.surface.rerenderDomSelection();
      });
    }
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

    // console.log('##### ContainerComponent.onDocumentChange', change);

    // Re-render 
    if (change.isAffected([this.props.node.id, 'nodes'])) {
      var self = this;
      // console.log('##### calling forceUpdate after document change');
      this.forceUpdate(function() {
      });
    }
  }

});

module.exports = ContentEditor;
var $$ = React.createElement;
var _ = require("substance/helpers");

// var LABELS = {
//   "paragraph": "Paragraph",
//   "heading": "Heading"
// };


var TEXT_TYPES = {
  "paragraph": {label: "Paragraph", data: {type: "paragraph"}},
  "heading1": {label: "Heading 1", data: {type: "heading", level: 1}},
  "heading2": {label: "Heading 2", data: {type: "heading", level: 2}},
  "heading3": {label: "Heading 3", data: {type: "heading", level: 3}}
};

// Text Tool
// ----------------

var TextTool = React.createClass({
  displayName: "TextTool",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  getDocument: function() {
    var app = this.context.app;
    return app.doc;
  },

  componentDidMount: function() {
    // var doc = this.getDocument();
    // doc.connect(this, {
    //   'document:changed': this.handleDocumentChange
    // });
  },

  componentWillMount: function() {
    var app = this.context.app;
    var toolManager = app.toolManager;
    toolManager.registerTool(this, "text");
  },

  handleClick: function(e) {
    e.preventDefault();
  },

  handleMouseDown: function(e) {
    e.preventDefault();

    var textType = TEXT_TYPES[e.currentTarget.dataset.type];
    if (!this.state.active) {
      console.log('NAAAAAY');
      return;
    }

    var surface = this.state.surface;
    var editor = surface.getEditor();
    editor.switchType(this.state.sel, textType.data);
  },

  getInitialState: function() {
    return {
      active: false,
      expanded: false
    };
  },

  disableTool: function() {
    this.setState({
      active: false
    });
  },

  toggleAvailableTextTypes: function(e) {
    e.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  getTextType: function(node) {
    var textType = node.type;
    if (textType === "heading") {
      textType += node.level;
    }
    return textType;
  },

  updateToolState: function(sel, surface) {
    if (sel.isPropertySelection()) {
      var doc = this.getDocument();
      var path = sel.getPath();

      var textType = this.getTextType(doc.get(path[0]));
      this.setState({
        surface: surface,
        sel: sel,
        currentTextType: textType,
        active: true
      });
    } else {
      this.setState({
        surface: surface,
        sel: sel,
        active: false
      });
    }
  },

  render: function() {
    var classNames = ['text-tool-component', 'tool'];
    if (this.state.active) classNames.push('active');

    var currentTextType = "None";
    if (this.state.currentTextType) {
      currentTextType = TEXT_TYPES[this.state.currentTextType].label;
    }
    
    var currentTextTypeEl = $$('a', {
      href: "#",
      className: "current-text-type",
      dangerouslySetInnerHTML: {__html: currentTextType + ' <i class="fa fa-sort-down"></i>'},
      onMouseDown: this.toggleAvailableTextTypes,
      onClick: this.handleClick
    });

    var availableTextTypes = $$('div');
    if (this.state.expanded) {
       availableTextTypes = _.map(TEXT_TYPES, function(textType, textTypeId) {
        return $$('a', {
          href: "#",
          className: 'text-type',
          "data-type": textTypeId,
          onMouseDown: this.handleMouseDown,
          onClick: this.handleClick
        }, textType.label);
      }.bind(this));
    }

    return $$("div", { className: classNames.join(' ')},
      currentTextTypeEl,
      $$('div', {className: "available-text-types"},
        availableTextTypes
      )
    );
  }
});

module.exports = TextTool;
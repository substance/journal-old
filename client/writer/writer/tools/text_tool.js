var $$ = React.createElement;

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
    var doc = this.getDocument();
    // doc.connect(this, {
    //   'document:changed': this.handleDocumentChange
    // });
  },

  handleClick: function(e) {
    e.preventDefault();
  },

  handleMouseDown: function(e) {
    e.preventDefault();
    if (!this.state.active) {
      return;
    }
    var doc = this.getDocument();
    doc.redo();
  },

  getInitialState: function() {
    return {
      active: false
    };
  },

  render: function() {
    var classNames = ['text-tool-component', 'tool'];
    if (this.state.active) classNames.push('active');

    return $$("div", {
      className: classNames.join(' '),
      href: "#",
      title: 'Redo',
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClick,
      dangerouslySetInnerHTML: {__html: 'Paragraph <i class="fa fa-sort-down"></i>'},
    });
  }
});

module.exports = TextTool;
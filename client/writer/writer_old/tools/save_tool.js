var $$ = React.createElement;

// Save Tool
// ----------------

var SaveTool = React.createClass({
  displayName: "SaveTool",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    var app = this.context.app;
    var doc = app.doc;

    doc.connect(this, {
      'document:changed': this.handleDocumentChange,
      'document:saved': this.handleDocumentSaved
    });
  },

  handleMouseDown: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var notifications = this.context.notifications;
    var app = this.context.app;
    var doc = app.doc;
    app.requestSave();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.active !== nextState.active;
  },

  handleDocumentSaved: function() {
    this.setState({
      active: false
    });    
  },

  handleDocumentChange: function(change) {
    this.setState({
      active: true
    });
  },

  getInitialState: function() {
    return {
      active: false
    }
  },

  render: function() {
    var classNames = ['save-tool-component', 'tool'];
    if (this.state.active) classNames.push('active');

    return $$("a", {
      className: classNames.join(' '),
      href: "#",
      dangerouslySetInnerHTML: {__html: '<i class="fa fa-save"></i>'},
      title: 'Save',
      onMouseDown: this.handleMouseDown
    });
  }
});

module.exports = SaveTool;
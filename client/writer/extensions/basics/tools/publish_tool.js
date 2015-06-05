var $$ = React.createElement;

// Publish Tool
// ----------------

var PublishTool = React.createClass({
  displayName: "SaveTool",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    var app = this.context.app;
    var doc = app.doc;

    // doc.connect(this, {
    //   'document:changed': this.handleDocumentChange,
    //   'document:saved': this.handleDocumentSaved
    // });
  },

  handleClick: function(e) {
    e.preventDefault(e);
  },
  
  handleMouseDown: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var app = this.context.app;
    var doc = app.doc;

    var notifications = this.context.notifications;
    var publishedDate = doc.get('document').published_on;

    console.log('publishedDate', publishedDate);
    var active;
    if (publishedDate) {
      doc.set(['document', "published_on"], null);
      active = false;
    } else {
      doc.set(['document', "published_on"], new Date().toJSON());
      active = true;
    }
    
    this.setState({
      active: active
    });

    app.requestSave();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.active !== nextState.active;
  },

  // handleDocumentSaved: function() {
  //   this.setState({
  //     active: false
  //   });    
  // },


  // handleDocumentChange: function(change) {
  //   // this.setState({
  //   //   active: true
  //   // });
  // },

  getInitialState: function() {
    var app = this.context.app;
    var doc = app.doc;
    var published_on = doc.get('document').published_on;
    return {
      active: !!published_on
    }
  },

  render: function() {
    var classNames = ['publish-tool-component', 'tool'];
    if (this.state.active) classNames.push('active');

    return $$("a", {
      className: classNames.join(' '),
      href: "#",
      dangerouslySetInnerHTML: {__html: 'Publish <i class="fa fa-toggle-off"></i>'},
      title: 'Save',
      onClick: this.handleClick,
      onMouseDown: this.handleMouseDown
    });
  }
});

module.exports = PublishTool;
var $$ = React.createElement;
var _ = require("substance/helpers");


var DocumentRecord = React.createClass({
  displayName: "DocumentRecord",

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },
  handleOpenDocument: function(e) {
    var app = this.context.app;
    e.preventDefault();

    var documentId = e.currentTarget.dataset.id;

    app.replaceState({
      context: "writer",
      documentId: documentId
    });

  },

  getPublishDate: function() {
    if (this.props.published_on) {
      return new Date(this.props.published_on).toDateString();  
    } else {
      return "";
    }
  },

  render: function() {
    return $$("div", {className: "document"},
      $$('div', {className: "label"}, this.props.published ? "publication" : "draft"),
      $$('div', {className: "published_on"}, this.getPublishDate()),
      $$('div', {className: "title"},
        $$('a', {href: "#", "data-id": this.props.id, onClick: this.handleOpenDocument}, this.props.title)
      ),
      $$('div', {className: "abstract"}, this.props.abstract),
      $$('div', {className: "author"}, this.props.creator.name)
    );
  }
});


// The Dashboard
// ----------------

var Dashboard = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      documents: []
    };
  },

  componentDidMount: function() {
    var backend = this.context.backend;
    backend.getDocuments(function(err, documents) {
      console.log('docs', documents);
      this.setState({
        documents: documents
      });
    }.bind(this));
  },

  displayName: "Dashboard",

  render: function() {
    var state = this.state;

    return $$("div", {className: "dashboard-component"},
      $$("div", {className: "header"},
        state.documents.length + " articles"
      ),
      $$("div", {className: "documents"},
        _.map(state.documents, function(doc) {
          return $$(DocumentRecord, doc);
        })
      )
    );
  }
});

module.exports = Dashboard;
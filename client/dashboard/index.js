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

  handleDeleteDocument: function(e) {
    e.preventDefault();
    var documentId = e.currentTarget.dataset.id;
    this.props.handleDeleteDocument(documentId);
  },

  getPublishDate: function() {
    if (this.props.doc.published_on) {
      return new Date(this.props.doc.published_on).toDateString();  
    } else {
      return "";
    }
  },

  render: function() {
    return $$("div", {className: "document"},
      $$('div', {className: "label"}, this.props.doc.published ? "publication" : "draft"),
      $$('div', {className: "published_on"}, this.getPublishDate()),
      $$('div', {className: "title"},
        $$('a', {href: "#", "data-id": this.props.doc.id, onClick: this.handleOpenDocument}, this.props.doc.title)
      ),
      $$('div', {className: "abstract"}, this.props.doc.abstract),
      $$('div', {className: "author"}, this.props.doc.creator.name),
      $$('a', {href: "#", "data-id": this.props.doc.id, className: "delete-document", onClick: this.handleDeleteDocument}, "Delete")
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

  handleDeleteDocument: function(documentId) {
    var backend = this.context.backend;
    backend.deleteDocument(documentId, function(err) {
      // We could skip the reload when we manage to delete the affected docs ourselves
      // from the documents array
      backend.getDocuments(function(err, documents) {
        if (err) {
          return console.error(err);
        }
        this.setState({
          documents: documents
        });
      }.bind(this));

    }.bind(this));
  },

  componentDidMount: function() {
    var backend = this.context.backend;
    if (backend.isAuthenticated()) {
      backend.getDocuments(function(err, documents) {
        if (err) {
          return console.error(err);
        }
        this.setState({
          documents: documents
        });
      }.bind(this));      
    }
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
          return $$(DocumentRecord, {
            doc: doc,
            handleDeleteDocument: this.handleDeleteDocument
          });
        }.bind(this))
      )
    );
  }
});

module.exports = Dashboard;
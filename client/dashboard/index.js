var $$ = React.createElement;
var _ = require("substance/helpers");

var FAKE_DATA = [
  {
    title: "Advancing biology through a deeper understanding of zebrafish ecology and evolution",
    abstract: "A better understanding of the remarkable diversity, natural history and complex ecology of E. coli in the wild could shed new light on its biology and role in disease, and further expand its many uses as a model organism.",
    user: {name: "Michael Aufreiter"},
    published: true,
    published_on: "2015-05-03",
    updated_at: "2015-05-19T20:46:53.973Z",
    created_at: "2015-05-19T20:46:53.973Z"
  },

  {
    title: "C. elegans outside the Petri dish",
    abstract: "Comparing maize to its wild ancestor teosinte advances our understanding of how it and other cereal crops evolved, and also identifies the genetic variation that can contribute to important agricultural traits.",
    user: {name: "John Doe"},
    published: false,
    updated_at: "2015-05-19T20:46:53.973Z",
    created_at: "2015-05-19T20:46:53.973Z"
  },

  {
    title: "The fascinating and secret wild life of the budding yeast S. cerevisiae",
    abstract: "The life cycle and morphology of the sea squirt Ciona intestinalis shed light on vertebrate evolution.",
    user: {name: "John Doe"},
    published: true,
    published_on: "2015-05-03",
    updated_at: "2015-05-19T20:46:53.973Z",
    created_at: "2015-05-19T20:46:53.973Z"
  }
];


var DocumentRecord = React.createClass({
  displayName: "DocumentRecord",

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
        $$('a', {href: "#"}, this.props.title)
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
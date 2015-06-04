'use strict';

// Journal Writer
// ---------------
// 
// Configures a simple writer for the substance journal, using the generic SubstanceWriter implementation

var Substance = require("substance");
var _ = require("substance/helpers");
var $$ = React.createElement;


// Core Writer Stuff lives in the writer folder
// ---------------
// 

var SubstanceReader = require("substance-ui/reader");

// Article
// ---------------
// 
// This can be replaced with your custom article implementation

var Article = require("../article");

// Writer Extensions (plugins)
var readerExtensions = require("./extensions");

// Component Factory
// ---------------
// 
// Extract a component factory from core and writerExtensions and expose it via 'context'
// all registered extensions should 

var componentFactory = new Substance.Factory();

_.each(readerExtensions, function(extension) {
  _.each(extension.components, function(ComponentClass, name) {
    componentFactory.add(name, ComponentClass);
  });
});



console.log('COMPONENT FACTORY', componentFactory);


// HTML Importer Configuration
// ---------------
// 

// var htmlImporter = new Substance.Document.HtmlImporter({
//   schema: Article.schema,
//   trimWhitespaces: true,
//   REMOVE_INNER_WS: true,
// });

// default handling for elemens with are not in the model
// htmlImporter.defaultConverter = function(el, converter) {
//   return {
//     type: 'text',
//     content: el.textContent
//   };
// };

// Specify a Notification service
// ---------------
// 
// Adjust to your needs

// var htmlExporter = new Substance.Document.HtmlExporter({
//   // configuration
// });

var writerContext = {
  componentFactory: componentFactory//,
  // htmlImporter: htmlImporter,
  // htmlExporter: htmlExporter
};

// Top Level Application
// ---------------
// 
// Adjust for your own needs

var JournalReader = React.createClass({
  displayName: "JournalReader",

  contextTypes: {
    backend: React.PropTypes.object.isRequired //,
    // notifications: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    componentFactory: React.PropTypes.object,
    htmlImporter: React.PropTypes.object,
    htmlExporter: React.PropTypes.object
  },

  getChildContext: function() {
    return writerContext;
  },

  componentDidMount: function() {
    var backend = this.context.backend;
    backend.getDocument(this.props.documentId || "example_document", function(err, doc) {
      this.setState({
        doc: doc
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      doc: null
    };
  },

  render: function() {
    if (this.state.doc) {
      return $$(SubstanceReader, {
        config: {
          extensions: readerExtensions
        },
        doc: this.state.doc,
        id: "writer"
      });
    } else {
      return $$('div', null, 'Loading document...');
    }
  }
});


module.exports = JournalReader;
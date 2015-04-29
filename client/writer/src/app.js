'use strict';

// Writer Application
// ---------------
// 
// Main entry point of the writer application. In this file all configurations
// are made.

var Substance = require("substance");
var _ = require("substance/helpers");
var $$ = React.createElement;

// Core Writer Stuff lives in the writer module
// ---------------
// 

var Writer = require("./writer");

// Article
// ---------------
// 
// This can be replaced with your custom article implementation

var Article = require("./article");

// Writer Modules (configuration)
var writerExtensions = require("./writer_extensions");

// Component Factory
// ---------------
// 
// Extract a component factory from core and writerExtensions and expose it via 'context'
// all registered extensions should 

var componentFactory = new Substance.Factory();

var coreComponents = require("./writer/components");

_.each(coreComponents, function(ComponentClass, name) {
  componentFactory.add(name, ComponentClass);
});

_.each(writerExtensions, function(extension) {
  _.each(extension.components, function(ComponentClass, name) {
    componentFactory.add(name, ComponentClass);
  });
});

// Specify a backend
// ---------------
// 

var Backend = require("./backend");

// window.devMode = true;

// Create instance of metadata service
var backend = new Backend();

// Specify a Notification service
// ---------------
// 
// This is used for user notifications, displayed in the status bar

var NotificationService = require("./notification_service");
var notifications = new NotificationService();


// HTML Importer Configuration
// ---------------
// 

var htmlImporter = new Substance.Document.HtmlImporter({
  schema: Article.schema,
  trimWhitespaces: true,
  REMOVE_INNER_WS: true,
});

// default handling for elemens with are not in the model
htmlImporter.defaultConverter = function(el, converter) {
  return {
    type: 'text',
    content: el.textContent
  };
};

// Specify a Notification service
// ---------------
// 
// Adjust to your needs

var htmlExporter = new Substance.Document.HtmlExporter({
  // configuration
});

var globalContext = {
  componentFactory: componentFactory,
  backend: backend,
  notifications: notifications,
  htmlImporter: htmlImporter,
  htmlExporter: htmlExporter
};

// Top Level Application
// ---------------
// 
// Adjust for your own needs

var WriterApp = React.createClass({
  displayName: "WriterApp",

  childContextTypes: {
    componentFactory: React.PropTypes.object,
    backend: React.PropTypes.object,
    notifications: React.PropTypes.object,
    htmlImporter: React.PropTypes.object,
    htmlExporter: React.PropTypes.object
  },

  getChildContext: function() {
    return globalContext;
  },

  componentDidMount: function() {
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
      return $$(Writer, {
        config: {
          extensions: writerExtensions
        },
        doc: this.state.doc,
        id: "writer"
      });
    } else {
      return $$('div', null, 'Loading document...');
    }
  }
});

var app = {
  start: function() {
    React.render(
      $$(WriterApp, {
        documentId: window.location.hash.slice(1)
      }),
      document.getElementById('container')
    );
  }
};

module.exports = app;
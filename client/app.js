'use strict';

// Substance Journal
// ---------------
// 
// Main entry point of the Substance Journal web client

var _ = require("substance/helpers");
var $$ = React.createElement;

// Specify a backend
// ---------------
// 

var Backend = require("./shared/backend");
var backend = new Backend();

// Specify a notification service
// ---------------
// 
// This is used for user notifications, displayed in the status bar

var NotificationService = require("./shared/notification_service");
var notifications = new NotificationService();

var appContext = {
  backend: backend,
  notifications: notifications,
};

// Components
var Menu = require("./shared/menu");

var Dashboard = require("./dashboard");

// Top Level Application
// ---------------
// 

var App = React.createClass({
  displayName: "App",

  childContextTypes: {
    backend: React.PropTypes.object,
    notifications: React.PropTypes.object,
  },

  getChildContext: function() {
    return appContext;
  },

  // componentDidMount: function() {
  //   backend.getDocument(this.props.documentId || "example_document", function(err, doc) {
  //     this.setState({
  //       doc: doc
  //     });
  //   }.bind(this));
  // },

  getInitialState: function() {
    return {
      context: "dashboard"
    };
  },

  handleContextSwitch: function(context) {
    this.replaceState({
      context: "dashboard"
    })
  },

  render: function() {
    var appContextEl = $$('div', {className: "my-context"});

    return $$('div', {className: ""},
      $$(Menu, {
        handleContextSwitch: this.handleContextSwitch
      }),
      appContextEl
    );

    // if (this.state.doc) {
    //   return $$(Writer, {
    //     config: {
    //       extensions: writerExtensions
    //     },
    //     doc: this.state.doc,
    //     id: "writer"
    //   });
    // } else {
    //   return $$('div', null, 'Loading document...');
    // }
  }
});

// Start the app

$(function() {
  React.render(
    $$(App, {
      documentId: window.location.hash.slice(1)
    }),
    document.getElementById('container')
  );
});

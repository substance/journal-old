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

// React Components
// ---------------
// 

var Reader = require("./reader");

// Top Level Application
// ---------------
// 

var App = React.createClass({
  displayName: "App",

  childContextTypes: {
    backend: React.PropTypes.object,
    notifications: React.PropTypes.object,
    app: React.PropTypes.object
  },

  getChildContext: function() {
    return _.extend({
      app: this
    }, appContext);
  },

  render: function() {
    return $$('div', {className: "app-component"},
      $$(Reader, {
        documentId: "1"
      })
    );
  }
});

// Start the app

$(function() {
  React.render(
    $$(App, {
      documentId: "1",
      // route: window.location.hash.slice(1)
    }),
    document.getElementById('container')
  );
});

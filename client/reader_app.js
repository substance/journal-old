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

var Menu = require("./shared/menu");

// Available contexts
var Dashboard = require("./dashboard");
var Admin = require("./admin");
var Writer = require("./writer");

var CONTEXTS = {
  "dashboard": Dashboard,
  "admin": Admin,
  "writer": Writer
};


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

  getStateFromRoute: function(route) {
    var parts = route.split(";");
    var state = {};

    if (route) {
      _.each(parts, function(part) {
        var keyVal = part.split("=");
        state[keyVal[0]] = keyVal[1];
      });      
    } else {
      state.context = "dashboard";
    }
    
    return state;
  },

  getRouteFromState: function(state) {
    var routeParts = [];
    _.each(state, function(value, key) {
      routeParts.push([key, value].join("="));
    });

    return routeParts.join(";");
  },

  getInitialState: function() {
    var initState = this.getStateFromRoute(this.props.route);
    return initState;
  },

  componentWillUpdate: function(nextProps, nextState) {
    var route = this.getRouteFromState(nextState);
    history.replaceState({} , '', '#'+route);
  },

  handleContextSwitch: function(context) {
    var newState = {
      context: context
    };

    if (this.props.documentId) {
      newState.documentId = this.props.documentId;
    }
    this.replaceState(newState);
  },

  // Extract props from the app state to parametrize the active child view
  extractProps: function() {
    var props = JSON.parse(JSON.stringify(this.state));
    delete props.context;
    return props;
  },

  getContextElement: function() {
    var ContextClass = CONTEXTS[this.state.context];
    var props = this.extractProps();
    return $$(ContextClass, props);
  },

  render: function() {
    var appContextEl;

    return $$('div', {className: "app-component"},
      $$(Menu, {
        context: this.state.context,
        handleContextSwitch: this.handleContextSwitch
      }),
      this.getContextElement()
    );
  }
});

// Start the app

$(function() {

  React.render(
    $$(App, {
      route: window.location.hash.slice(1)
    }),
    document.getElementById('container')
  );
});


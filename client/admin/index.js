var $$ = React.createElement;
var AdminMenu = require("./admin_menu");

// Contexts
// --------------

var JournalAdmin = require("./journal_admin");
var UserAdmin = require("./user_admin");
var EditUser = require("./edit_user");
var AddUser = require("./add_user");

var CONTEXTS = {
  "journal": JournalAdmin,
  "user": UserAdmin,
  "editUser": EditUser,
  "addUser": AddUser
};

// Admin
// ----------------

var Admin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "Admin",

  getInitialState: function() {
    return {
      contextId: "journal"
    };
  },

  handleStateChange: function(newState) {
    this.replaceState(newState);
  },

  // Extract props from the app state to parametrize the active child view
  extractProps: function() {
    var props = JSON.parse(JSON.stringify(this.state));
    props.handleStateChange = this.handleStateChange;
    delete props.contextId;
    return props;
  },

  getContextElement: function() {
    var ContextClass = CONTEXTS[this.state.contextId];
    var props = this.extractProps();
    return $$(ContextClass, props);
  },

  render: function() {
    return $$("div", {className: "admin-component"},
      $$(AdminMenu, {
        context: this.state.contextId,
        handleStateChange: this.handleStateChange
      }),
      $$("div", {className: "admin-context-container"},
        this.getContextElement()
      )
    );
  }
});

module.exports = Admin;
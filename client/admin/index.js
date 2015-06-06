var $$ = React.createElement;

var AdminMenu = require("./admin_menu");

// Contexts
// --------------

var JournalAdmin = require("./journal_admin");
var UserAdmin = require("./user_admin");

var CONTEXTS = {
  "journal": JournalAdmin,
  "user": UserAdmin
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
      contextId: "user"
    };
  },

  handleContextSwitch: function(contextId) {
    var newState = {
      contextId: contextId
    };

    this.replaceState(newState);
  },

  getContextElement: function() {
    var ContextClass = CONTEXTS[this.state.contextId];
    // var props = this.extractProps();
    return $$(ContextClass);
  },

  render: function() {
    return $$("div", {className: "admin-component"},
      $$(AdminMenu, {
        context: this.state.contextId,
        handleContextSwitch: this.handleContextSwitch
      }),
      $$("div", {className: "admin-context-container"},
        this.getContextElement()
      )
    );
  }
});

module.exports = Admin;
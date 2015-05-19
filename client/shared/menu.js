var $$ = React.createElement;
var _ = require("substance/helpers");

var menuItems = [
  {"name": "dashboard", "label": "Dashboard"},
  {"name": "admin", "label": "Admin"},
  {"name": "writer", "label": "Example Document"}
];

// The Menu
// ----------------

var Menu = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired,
    app: React.PropTypes.object.isRequired,
  },

  displayName: "Menu",

  handleMenuSelection: function(e) {
    var context = e.currentTarget.dataset.id;
    this.props.handleContextSwitch(context);
  },

  handleLogin: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var app = this.context.app;
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    console.log('handling login...', username, password);

    backend.authenticate(username, password, function(err, session) {
      console.log('yay authenticated', session);
      app.replaceState({
        context: "dashboard"
      });
    });
  },

  handleLogout: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var app = this.context.app;

    backend.logout(function() {
      app.replaceState({
        context: "dashboard"
      });
    });
  },

  getLoginInfo: function() {
    var backend = this.context.backend;
    if (backend.isAuthenticated()) {
      return this.getUserStatus();
    } else {
      return this.getLoginBox();
    }
  },

  getUserStatus: function() {
    var user = this.context.backend.getUser();
    return $$('div', {className: "user-status-component"},
      $$('div', {className: "user-info"},
        $$('div', null, user.name || user.email)
      ),
      $$('div', {className: "user-actions"},
        $$('a', {
          href: "#",
          className: "user-action",
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-file-text-o"></i> New document'}
        }),
        $$('a', {
          href: "#",
          className: "user-action",
          onClick: this.handleLogout,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-power-off"></i> Logout'}
        })
      )
    );
  },

  getLoginBox: function() {
    return $$('div', {className: "login-box-component"},
      $$('form', {onSubmit: this.handleLogin},
        $$('input', {ref: "username", className: "username", type: "text", placeholder: "Username"}),
        $$('input', {ref: "password", className: "password", type: "password", placeholder: "Password"}),
        $$('input', {className: "login-button", type: "submit", value: "Login"})
      )
    );
  },

  render: function() {
    console.log('render Menu');
    return $$("div", {className: "menu-component"},

      $$('div', {className: "app-contexts"},
        _.map(menuItems, function(menuItem) {
          return $$('a', {
            className: "app-context"+(this.props.context === menuItem.name ? " active" : ""),
            "data-id": menuItem.name,
            key: menuItem.name,
            href: "#",
            onClick: this.handleMenuSelection
          }, menuItem.label);
        }, this)
      ),
      this.getLoginInfo()
    );
  }
});

module.exports = Menu;
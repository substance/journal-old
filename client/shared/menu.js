var $$ = React.createElement;
var _ = require("substance/helpers");


var menuItems = [
  {"name": "dashboard", "label": "Articles", "icon": "files-o"},
  {"name": "admin", "label": "Admin", "icon": "cog"}
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
    e.preventDefault();
    var context = e.currentTarget.dataset.id;
    this.props.handleContextSwitch(context);
  },

  handleLogin: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var app = this.context.app;
    var username = this.refs.username.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    backend.authenticate(username, password, function(err) {
      if (err) {
        alert('Login failed. Please try again');
        return;
      }
      app.replaceState({
        context: "dashboard"
      });
    });
  },

  handleNewDocument: function(e) {
    e.preventDefault();
    var backend = this.context.backend;
    var app = this.context.app;
    backend.createDocument(function(err, documentRecord) {
      app.replaceState({
        context: "writer",
        documentId: documentRecord.id+""
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
    var user = this.context.backend.getUserInfo();
    return $$('div', {className: "user-status-component"},
      $$('div', {className: "user-info"},
        $$('div', null, user.name || user.email)
      ),
      $$('div', {className: "user-actions"},

        $$('a', {
          href: "#",
          className: "user-action",
          onClick: this.handleLogout,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-power-off"></i>'},
          title: "Logout"
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

    var menuItemEls = [];

    menuItemEls.push($$('a', {
      className: "app-context",
      key: "journal",
      href: "/",
      target: "_blank",
      title: "Visit the journal",
      dangerouslySetInnerHTML: {__html: '<i class="fa fa-align-left"></i>'}
    }));

    _.each(menuItems, function(menuItem) {
      menuItemEls.push($$('a', {
        className: "app-context"+(this.props.context === menuItem.name ? " active" : ""),
        "data-id": menuItem.name,
        key: menuItem.name,
        href: "#",
        onClick: this.handleMenuSelection,
        dangerouslySetInnerHTML: {__html: '<i class="fa fa-'+menuItem.icon+'"></i> ' + menuItem.label}
      }));
    }, this);

    menuItemEls.push($$('a', {
      className: "app-context",
      key: "new",
      href: "#",
      onClick: this.handleNewDocument,
      dangerouslySetInnerHTML: {__html: '<i class="fa fa-plus"></i> New article'}
    }));

    return $$("div", {className: "menu-component"},
      $$('div', {className: "app-contexts"},
        menuItemEls
      ),
      this.getLoginInfo()
    );
  }
});

module.exports = Menu;
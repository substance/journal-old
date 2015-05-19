var $$ = React.createElement;

// The Menu
// ----------------

var Menu = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "Menu",

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "menu-component"},
      $$('div', {className: "app-contexts"},
        $$('a', {className: "app-context", "data-id": "dashboard", href: "#"}, "Dashboard"),
        $$('a', {className: "app-context", "data-id": "admin", href: "#"}, "Admin"),
        $$('a', {className: "app-context", "data-id": "writer", href: "#"}, "Example Doc")
      )
    );
  }
});

module.exports = Menu;
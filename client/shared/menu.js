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
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "Menu",

  handleMenuSelection: function(e) {
    var context = e.currentTarget.dataset.id;
    this.props.handleContextSwitch(context);
  },

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "menu-component"},

      $$('div', {className: "app-contexts"},
        _.map(menuItems, function(menuItem) {
          return $$('a', {
            className: "app-context"+(this.props.context === menuItem.name ? " active" : ""),
            "data-id": menuItem.name,
            href: "#",
            onClick: this.handleMenuSelection
          }, menuItem.label);
        }, this)
      )
    );
  }
});

module.exports = Menu;
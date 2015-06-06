var $$ = React.createElement;
var _ = require("substance/helpers");

var menuItems = [
  {"name": "journal", "label": "General", "icon": "users"},
  {"name": "user", "label": "Users", "icon": "cog"}
];

// The AdminMenu
// ----------------

var AdminMenu = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired,
    app: React.PropTypes.object.isRequired,
  },

  displayName: "Menu",

  handleMenuSelection: function(e) {
    e.preventDefault();
    var contextId = e.currentTarget.dataset.id;
    this.props.handleStateChange({
      contextId: contextId
    });
  },

  render: function() {
    return $$("div", {className: "admin-menu-component"},
      $$('div', {className: "admin-contexts"},
        _.map(menuItems, function(menuItem) {
          return $$('a', {
            className: "admin-context"+(this.props.context === menuItem.name ? " active" : ""),
            "data-id": menuItem.name,
            key: menuItem.name,
            href: "#",
            onClick: this.handleMenuSelection,
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-'+menuItem.icon+'"></i> ' + menuItem.label},
          });
        }, this)
      )
    );
  }
});

module.exports = AdminMenu;
var $$ = React.createElement;

// Admin
// ----------------

var Admin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "Admin",

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "admin-component"},
      "I AM THE ADMIN PANEL!"
    );
  }
});

module.exports = Admin;
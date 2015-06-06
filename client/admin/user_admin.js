var $$ = React.createElement;

// UserAdmin
// ----------------

var UserAdmin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "UserAdmin",

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "user-admin-component"},
      "I AM THE USER ADMIN!"
    );
  }
});

module.exports = UserAdmin;
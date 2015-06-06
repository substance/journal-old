var $$ = React.createElement;
var _ = require("substance/helpers");

// UserAdmin
// ----------------

var UserAdmin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  displayName: "UserAdmin",

  componentDidMount: function() {
    var backend = this.context.backend;
    if (backend.isAuthenticated()) {
      backend.getUsers(function(err, users) {
        if (err) {
          return console.error(err);
        }
        this.setState({
          users: users
        });
      }.bind(this));
    }
  },

  handleDeleteUser: function(e) {
    e.preventDefault();
    var username = e.currentTarget.dataset.id;
    var backend = this.context.backend;
    console.log('deleting user', username);

    backend.deleteUser(documentId, function(err) {
      this.props.handleStateChange({
        contextId: "user"
      })
    }.bind(this));
  },

  handleEditUser: function(e) {
    e.preventDefault();
    var username = e.currentTarget.dataset.id;
    // console.log('editing user', username);

    this.props.handleStateChange({
      contextId: 'editUser',
      username: username
    });
  },

  getInitialState: function() {
    return {
      users: []
    };
  },

  render: function() {
    var state = this.state;

    return $$("div", {className: "user-admin-component"},
      $$("div", {className: "header"},
        (state.users.length + " users"),
        $$("div", {className: "actions"},
          $$('a', {className: "add-user"}, "Add User")
        )
      ),

      $$("div", {className: "users"},
        _.map(state.users, function(user) {
          return $$("div", {href: "#", className: "user"},
            $$('div', {className: "info"},
              $$('a', {href: "#", "data-id": user.username, className: "name", onClick: this.handleEditUser}, user.name),
              $$('div', {className: "username"}, user.username)
            ),
            $$('div', {className: "user-actions"},
              $$('a', {href: "#", "data-id": user.username, className: "delete-user", onClick: this.handleDeleteUser}, "Delete")
            )
          );
        }.bind(this))
      )
    );
  }
});

module.exports = UserAdmin;
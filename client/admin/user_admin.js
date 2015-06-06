var $$ = React.createElement;
var _ = require("substance/helpers");

var UserRecord = React.createClass({
  displayName: "UserRecord",

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  handleEditUser: function(e) {
    var app = this.context.app;
    e.preventDefault();

    var userId = e.currentTarget.dataset.id;
    app.replaceState({
      context: "editUser",
      userId: userId
    });
  },

  handleDeleteUser: function(e) {
    e.preventDefault();
    var userId = e.currentTarget.dataset.id;
    this.props.handleDeleteUser(userId);
  },

  getPublishDate: function() {
    if (this.props.doc.published_on) {
      return new Date(this.props.doc.published_on).toDateString();  
    } else {
      return "";
    }
  },

  render: function() {
    return $$("a", {href: "#", className: "user", onClick: this.handleEditUser},
      $$('div', {className: "username"}, this.props.user.username),
      $$('div', {className: "name"}, this.props.user.name),
      $$('div', {href: "#", "data-id": this.props.user.id, className: "delete-user", onClick: this.handleDeleteUser}, "Delete")
    );
  }
});


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

  getInitialState: function() {
    return {
      users: []
    };
  },

  render: function() {
    var state = this.state;

    return $$("div", {className: "user-admin-component"},
      $$("div", {className: "header"},
        state.users.length + " users"
      ),
      $$("div", {className: "users"},
        _.map(state.users, function(user) {
          return $$(UserRecord, {
            user: user,
            handleDeleteUser: this.handleDeleteUser
          });
        }.bind(this))
      )
    );
  }
});

module.exports = UserAdmin;
var $$ = React.createElement;

// AddUser
// ----------------

var AddUser = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  displayName: 'AddUser',

  getInitialState: function() {
    return {};
  },

  handleCreateUser: function(e) {
    e.preventDefault();
    var backend = this.context.backend;

    var userData = {
      username: this.refs.username.getDOMNode().value,
      // name: this.refs.name.getDOMNode().value,
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value,
    };

    backend.createUser(userData, function(err) {
      if (err) {
        alert(err);
      }
      this.props.handleStateChange({
        contextId: "editUser",
        username: userData.username
      });
    }.bind(this));
  },

  render: function() {
    var state = this.state;

    return $$('div', {className: 'edit-user-component'},
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Username"),
        $$('input', {ref: 'username', type: 'text'}),
        $$('p', {className: 'description'}, "System username")
      ),
      // $$('div', {className: 'form-group'},
      //   $$('div', {className: 'label'}, "Full Name"),
      //   $$('input', {ref: 'name', type: 'text',}),
      //   $$('p', {className: 'description'}, "Use your real name so people can recognize you.")
      // ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Email"),
        $$('input', {ref: 'email', type: 'text'}),
        $$('p', {className: 'description'}, "User email")
      ),

      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Password"),
        $$('input', {ref: 'password', type: 'password'})
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Confirm password"),
        $$('input', {type: 'password'})
      ),
      $$('div', {className: 'form-group'},
        $$('a', {onClick: this.handleCreateUser, href: '#', className: 'create-user-button'}, "Create user")
      )
    );
  }
});

module.exports = AddUser;
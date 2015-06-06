var $$ = React.createElement;

// EditUser
// ----------------

var EditUser = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  displayName: 'EditUser',

  componentDidMount: function() {
    var backend = this.context.backend;

    if (backend.isAuthenticated()) {
      backend.getUser(this.props.username, function(err, user) {
        if (err) {
          return console.error(err);
        }
        this.setState({
          user: user
        });
      }.bind(this));
    }
  },

  getInitialState: function() {
    return {};
  },

  handleSave: function(e) {
    e.preventDefault();
    console.log('updating user');
    var backend = this.context.backend;

    var userData = {
      name: this.refs.name.getDOMNode().value,
      email: this.refs.email.getDOMNode().value,
      location: this.refs.location.getDOMNode().value,
      bio: this.refs.bio.getDOMNode().value,
      password: this.refs.password.getDOMNode().value,
    };

    // console.log('userdata', userData);

    backend.updateUser(this.state.user.username, userData, function(err) {
      console.log('stored userdata');
    });

  },

  render: function() {
    var state = this.state;
    if (!state.user) return $$('div');

    return $$('div', {className: 'edit-user-component'},
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Username"),
        $$('p', {className: 'description'}, state.user.username)
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Full Name"),
        $$('input', {ref: 'name', type: 'text', defaultValue: state.user.name}),
        $$('p', {className: 'description'}, "Use your real name so people can recognize you.")
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Email"),
        $$('input', {ref: 'email', type: 'text', defaultValue: state.user.email}),
        $$('p', {className: 'description'}, "User email")
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Location"),
        $$('input', {ref: 'location', type: 'text', defaultValue: state.user.location}),
        $$('p', {className: 'description'}, "User location")
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Bio"),
        $$('input', {ref: 'bio', type: 'text', defaultValue: state.user.bio}),
        $$('p', {className: 'description'}, "Short biography. This will appear along with the user's posts.")
      ),

      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "New password"),
        $$('input', {ref: 'password', type: 'password', defaultValue: ''})
      ),
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Confirm password"),
        $$('input', {type: 'password', defaultValue: ''})
      ),
      $$('div', {className: 'form-group'},
        $$('a', {onClick: this.handleSave, href: '#', className: 'save-user-button'}, "Save")
      )
    );
  }
});

module.exports = EditUser;
var $$ = React.createElement;

// JournalAdmin
// ----------------


var JournalAdmin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  displayName: 'JournalAdmin',

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    var backend = this.context.backend;

    if (backend.isAuthenticated()) {
      backend.getSettings(function(err, settings) {
        if (err) {
          return console.error(err);
        }

        console.log('Loaded (settings): ', settings);

        this.setState({
          settings: settings
        });
      }.bind(this));
    }
  },

  // handleCreateUser: function(e) {
  //   e.preventDefault();
  //   var backend = this.context.backend;

  //   var userData = {
  //     username: this.refs.username.getDOMNode().value,
  //     // name: this.refs.name.getDOMNode().value,
  //     email: this.refs.email.getDOMNode().value,
  //     password: this.refs.password.getDOMNode().value,
  //   };

  //   backend.createUser(userData, function(err) {
  //     if (err) {
  //       alert(err);
  //     }
  //     this.props.handleStateChange({
  //       contextId: "editUser",
  //       username: userData.username
  //     });
  //   }.bind(this));
  // },

  render: function() {
    var state = this.state;

    return $$('div', {className: 'edit-user-component'},
      $$('div', {className: 'form-group'},
        $$('div', {className: 'label'}, "Journal Name"),
        $$('input', {ref: 'journalName', type: 'text'}),
        $$('p', {className: 'description'}, "Journal Name. Appears on the front page")
      ),
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
        $$('a', {onClick: this.handleUpdateSettings, href: '#', className: 'create-user-button'}, "Create user")
      )
    );
  }
});

module.exports = JournalAdmin;

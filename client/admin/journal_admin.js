var $$ = React.createElement;

// JournalAdmin
// ----------------

var JournalAdmin = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "JournalAdmin",

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "journal-admin-component"},
      "I AM THE JOURNAL ADMIN!"
    );
  }
});

module.exports = JournalAdmin;
var $$ = React.createElement;

// The Dashboard
// ----------------

var Dashboard = React.createClass({
  contextTypes: {
    notifications: React.PropTypes.object.isRequired
  },

  displayName: "Dashboard",

  getInitialState: function() {
    return {
      
    };
  },

  render: function() {
    return $$("div", {className: "dashboard-component"},
      "I AM THE DASHBOARD!"
    );
  }
});

module.exports = Dashboard;
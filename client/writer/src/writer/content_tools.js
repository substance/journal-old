var $$ = React.createElement;

// The Content Panel
// ----------------

var ContentTools = React.createClass({

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  displayName: "ContentTools",
  render: function() {
    var app = this.context.app;
    var tools = app.getTools();
    
    var props = {
      doc: this.props.doc,
      switchContext: this.props.switchContext
    };

    var toolComps = tools.map(function(tool, index) {
      props.key = index;
      return $$(tool, props);
    });

    return $$("div", {className: "content-tools-component"},
      $$('div', {className: "tools"},
        toolComps
      )
    );
  }
});

module.exports = ContentTools;
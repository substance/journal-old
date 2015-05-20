var TextComponentMixin = require("./text_component_mixin");
var TextProperty = require('./text_property');
var $$ = React.createElement;

var ParagraphComponent = React.createClass({
  mixins: [TextComponentMixin],
  displayName: "ParagraphComponent",
  render: function() {
    return $$("div", { className: "content-node paragraph", "data-id": this.props.node.id },
      $$(TextProperty, {
        ref: "textProp",
        doc: this.props.doc,
        path: [ this.props.node.id, "content"]
      })
    );
  }
});

module.exports = ParagraphComponent;
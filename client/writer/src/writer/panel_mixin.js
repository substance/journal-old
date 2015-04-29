var $$ = React.createElement;

var Substance = require("substance");
var Panel = Substance.Surface.Panel;

var PanelMixin = Substance.extend({}, Panel.prototype, {
  getScrollableContainer: function() {
    return this.refs.panelContent.getDOMNode();
  }
});

module.exports = PanelMixin;
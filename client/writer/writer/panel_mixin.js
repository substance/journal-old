var $$ = React.createElement;

var Substance = require("substance");
var Panel = Substance.Surface.Panel;


var PanelMixin = Substance.extend({}, Panel.prototype, {

  getDocument: function() {
    var app = this.context.app;
    return app.doc;
  },

  getPanelContentElement: function() {
    return this.refs.panelContent.getDOMNode();
  },

  getScrollableContainer: function() {
    return this.refs.panelContent.getDOMNode();
  },

  // Returns the cumulated height of a panel's content
  getContentHeight: function() {
    // initialized lazily as this element is not accessible earlier (e.g. during construction)
    // get the new dimensions
    // TODO: use outerheight for contentheight determination?
    var contentHeight = 0;
    var panelContentEl = this.getPanelContentElement();

    $(panelContentEl).children().each(function() {
     contentHeight += $(this).outerHeight();
    });
    return contentHeight;
  },

  // Returns the height of panel (inner content overflows)
  getPanelHeight: function() {
    var panelContentEl = this.getPanelContentElement();
    return $(panelContentEl).height();
  },

  getScrollPosition: function() {
    var panelContentEl = this.getPanelContentElement();
    return $(panelContentEl).scrollTop();
  }

});

module.exports = PanelMixin;
var $$ = React.createElement;
var _ = require("substance/helpers");
var PanelMixin = require("substance-ui/panel_mixin");

// TOC Panel extension
// ----------------

var TOCPanelMixin = _.extend({}, PanelMixin, {

  // State relevant things
  // ------------

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    var doc = this.getDocument();
    doc.connect(this, {
      'app:toc-entry:changed': this.setActiveTOCEntry,
      'document:changed': this.handleDocumentChange
    });
  },

  componentWillUnmount: function() {
    var doc = this.getDocument();
    doc.disconnect(this);
  },

  getInitialState: function() {
    var doc = this.props.doc;
    var tocNodes = doc.getTOCNodes();
    return {
      doc: doc,
      tocNodes: tocNodes,
      activeNode: tocNodes.length > 0 ? tocNodes[0].id : null
    };
  },

  handleDocumentChange: function(change/*, info*/) {
    var doc = this.getDocument();
    var needsUpdate = false;

    // Any headings updated? (also covers when new headings are arriving)
    _.each(change.updated.root, function(update, nodeId) {
      var node = doc.get(nodeId);
      if (node.type === "heading") needsUpdate = true;
    });

    // Any headings delete?
    _.each(change.deleted, function(node) {
      if (node.type === "heading") needsUpdate = true;
    });

    if (needsUpdate) {
      console.log('updating');
      this.setState({
        tocNodes: doc.getTOCNodes()
      });
    }
  },

  setActiveTOCEntry: function(nodeId) {
    this.setState({
      activeNode: nodeId
    });
  },

  handleClick: function(e) {
    var nodeId = e.currentTarget.dataset.id;
    console.log('clicked', nodeId);
    e.preventDefault();
    var doc = this.getDocument();
    doc.emit("app:toc-entry-selected", nodeId);
  },

  // Rendering
  // -------------------

  render: function() {
    var state = this.state;

    var tocEntries = _.map(state.tocNodes, function(node) {
      var level = node.level;
      var classNames = ["toc-entry", "level-"+level];

      if (state.activeNode === node.id) {
        classNames.push("active");
      }
      
      return $$('a', {
        className: classNames.join(" "),
        href: "#",
        "data-id": node.id,
        onClick: this.handleClick
      }, node.content);
    }, this);

    return $$("div", {className: "panel toc-panel-component"},
      $$("div", {className: "toc-entries"}, tocEntries)
    );
  }
});

var TOCPanel = React.createClass({
  mixins: [TOCPanelMixin],
  displayName: "Contents",
});

// Panel Configuration
// -----------------

TOCPanel.contextId = "toc";
TOCPanel.icon = "fa-align-left";

module.exports = TOCPanel;
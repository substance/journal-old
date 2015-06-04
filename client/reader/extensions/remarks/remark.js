var $$ = React.createElement;
var TextProperty = require("substance-ui/text_property");
var Substance = require("substance");

// Remark
// ----------------

var Remark = React.createClass({
  displayName: "Remark",

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },
  
  handleToggle: function(e) {
    var app = this.context.app;;
    var remarkId = this.props.remark.id;

    e.preventDefault();
    e.stopPropagation();

    var surface = app.getSurface();
    if (surface) {
      surface.setSelection(Substance.Document.Selection.nullSelection);  
    }

    if (app.state.remarkId === remarkId) {
      app.replaceState({
        contextId: "remarks"
      });
    } else {
      app.replaceState({
        contextId: "remarks",
        remarkId: remarkId,
        noScroll: true
      });
    }
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.doc.connect(this, {
      'document:changed': this.handleDocumentChange
    });
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.doc.disconnect(this);
  },

  handleDocumentChange: function(change, info) {
    var app = this.context.app;
    var doc = app.doc;
    var remark = doc.get(this.props.remark.id);
    if (!remark) return;

    // The following only reacts on changes to the remarks start and end
    // path, but not to changes to text in spanned nodes.
    // TODO: we need an event proxy here that better tells you that the covered
    // range has been affected (~ContainerAnnotation event proxy)
    if (change.isAffected(remark.startPath) || change.isAffected(remark.endPath)) {
      this.forceUpdate();
    }
  },

  handleDelete: function(e) {
    e.preventDefault();
    var app = this.context.app;
    var doc = app.doc;
    var tx = doc.startTransaction();

    try {
      tx.delete(this.props.remark.id);
      tx.save();
      app.replaceState({
        contextId: "remarks",
        remarkId: null
      });
    } finally {
      tx.cleanup();
    }
  },

  render: function() {
    var className = ["remark", this.props.type];
    if (this.props.active) className.push("active");
    var app = this.context.app;
    var doc = app.doc;
    // NOTE: having the remark as instance here is dangerous, as
    // it might have been removed from the document already.
    // TODO: don't store node instances in props
    var remark = doc.get(this.props.remark.id);
    var sourceText;
    if (!remark) {
      sourceText = "N/A";
    } else {
      sourceText = remark.getText();
    }

    // Shorten sourceText
    if (sourceText.length > 130) {
      sourceText = sourceText.slice(0,130) + " ...";
    }
    
    return $$("div", {className: className.join(" "), "data-id": remark.id},
      $$('div', {contentEditable: false, className: 'remark-header', onMouseDown: this.handleToggle},
        $$('a', {href: "#", className: 'remark-title'}, sourceText),
        $$('a', {
          href: "#",
          className: 'delete-remark',
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-remove"></i>'},
          onClick: this.handleDelete
        })
      ),

      $$(TextProperty, {
        tagName: "div",
        doc: app.doc,
        path: [this.props.remark.id, "content"]
      })
    );
  }
});


module.exports = Remark;
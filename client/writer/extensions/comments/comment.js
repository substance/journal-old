var $$ = React.createElement;
var TextProperty = require("substance-ui/text_property");
var Substance = require("substance");

// Comment
// ----------------

var Comment = React.createClass({
  displayName: "Comment",

  contextTypes: {
    app: React.PropTypes.object.isRequired
  },
  
  handleToggle: function(e) {
    var app = this.context.app;
    var commentId = this.props.comment.id;

    e.preventDefault();
    e.stopPropagation();

    var surface = app.getSurface();
    if (surface) {
      surface.setSelection(Substance.Document.Selection.nullSelection);  
    }

    if (app.state.commentId === commentId) {
      app.replaceState({
        contextId: "comments"
      });
    } else {
      app.replaceState({
        contextId: "comments",
        commentId: commentId,
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

  handleDocumentChange: function(change/*, info*/) {
    var app = this.context.app;
    var doc = app.doc;
    var comment = doc.get(this.props.comment.id);
    if (!comment) return;

    // The following only reacts on changes to the comments start and end
    // path, but not to changes to text in spanned nodes.
    // TODO: we need an event proxy here that better tells you that the covered
    // range has been affected (~ContainerAnnotation event proxy)
    if (change.isAffected(comment.startPath) || change.isAffected(comment.endPath)) {
      this.forceUpdate();
    }
  },

  handleDelete: function(e) {
    e.preventDefault();
    var app = this.context.app;
    var doc = app.doc;
    var tx = doc.startTransaction();

    try {
      tx.delete(this.props.comment.id);
      tx.save();
      app.replaceState({
        contextId: "comments",
        commentId: null
      });
    } finally {
      tx.cleanup();
    }
  },

  render: function() {
    var className = ["comment", this.props.type];
    if (this.props.active) className.push("active");
    var app = this.context.app;
    var doc = app.doc;
    // NOTE: having the comment as instance here is dangerous, as
    // it might have been removed from the document already.
    // TODO: don't store node instances in props
    var comment = doc.get(this.props.comment.id);
    var sourceText;
    if (!comment) {
      sourceText = "N/A";
    } else {
      sourceText = comment.getText();
    }

    // Shorten sourceText
    if (sourceText.length > 130) {
      sourceText = sourceText.slice(0,130) + " ...";
    }
    
    return $$("div", {className: className.join(" "), "data-id": comment.id},
      $$('div', {contentEditable: false, className: 'comment-header', onMouseDown: this.handleToggle},
        $$('a', {href: "#", className: 'comment-title'}, sourceText),
        $$('a', {
          href: "#",
          className: 'delete-comment',
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-remove"></i>'},
          onClick: this.handleDelete
        })
      ),

      $$(TextProperty, {
        tagName: "div",
        doc: app.doc,
        path: [this.props.comment.id, "content"]
      })
    );
  }
});


module.exports = Comment;
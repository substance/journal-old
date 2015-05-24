var Substance = require("substance");
var Document = Substance.Document;
var _ = require("substance/helpers");

var Heading = Document.TextNode.extend({
  name: "heading",
  properties: {
    "level": "number"
  }
});

// Html import
// -----------

Heading.static.blockType = true;

// TODO: find a way to describe that this class should be considered in the table of contents
// It is important to read this flag on the instance level like node.includeTOC. Static props
// seem not to be available on the instance level
Heading.static.includeInTOC = true;

Heading.static.matchElement = function(el) {
  var tagName = el.tagName.toLowerCase();
  return _.includes(["h1", "h2", "h3", "h4", "h5", "h6"], tagName);
};

Heading.static.fromHtml = function(el, converter) {
  var heading = {
    id: el.dataset.id || Substance.uuid('heading'),
    content: ''
  };
  heading.content = converter.annotatedText(el, [heading.id, 'content']);

  heading.level = 1;
  return heading;
};

module.exports = Heading;

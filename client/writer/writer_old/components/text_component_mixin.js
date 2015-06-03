var _ = require('substance/helpers');

// TextComponentMixin
// ----------------
//

var TextComponentMixin = {
  shouldComponentUpdate: function(nextProps, nextState) {
    var textAnnotations = _.pluck(this.refs.textProp.getAnnotations(), 'id');
    var textHighlights = _.intersection(textAnnotations, this.refs.textProp.getHighlights());

    var shouldUpdate = true;
    if (this._prevTextAnnotations) {
      if (_.isEqual(textAnnotations, this._prevTextAnnotations) && _.isEqual(textHighlights, this._prevTextHighlights)) {
        shouldUpdate = false;
      }
    }

    // Remember so we can check the next update
    this._prevTextAnnotations = textAnnotations;
    this._prevTextHighlights = textHighlights;

    return shouldUpdate;
  }


};

module.exports = TextComponentMixin;

var Substance = require("substance");
var Document = Substance.Document;
var _ = require("substance/helpers");

var ToolManager = require("substance").Surface.ToolManager;
var Highlight = require("./components/text_property").Highlight;
var ExtensionManager = require("./extension_manager");

var coreTools = require("./tools");
var coreComponents = require("./components");

// Mixin with helpers to implement a WriterController
// ----------------

function WriterController() {}

WriterController.Prototype = function() {

  this.getDocument = function() {
    throw new Error('Contract: A Writer must implement getDocument()');
  };

  this.getWriterState = function() {
    throw new Error('Contract: A Writer must implement getWriterState()');
  };

  // Internal Methods
  // ----------------------

  this._initializeController = function(doc, config) {
    
    // We need to do this manually since we can't call the EventEmitter constructor function
    this.__events__ = {};

    // Initialize doc
    var doc = this.getDocument();

    // For compatibility with extensions which rely on the app.doc instance
    this.doc = doc;

    var config = this.getConfig();

    // Initialize surface registry
    this.surfaces = {};

    doc.connect(this, {
      'transaction:started': this._transactionStarted,
      'document:changed': this._onDocumentChanged
    });

    this.toolManager = new ToolManager(this.doc, {
      isToolEnabled: this.isToolEnabled
    });

    this.extensionManager = new ExtensionManager(config.extensions, this);
  };

  this._transactionStarted = function(tx) {
    // store the state so that it can be recovered when undo/redo
    tx.before.state = this.state;
    tx.before.selection = this.getSelection();
    if (this.activeSurface) {
      tx.before.surfaceName = this.activeSurface.name;
    }
  };

  this._onDocumentChanged = function(change, info) {
    this.doc.__dirty = true;
    var notifications = this.context.notifications;

    notifications.addMessage({
      type: "info",
      message: "Unsaved changes"
    });

    // This is the undo/redo case
    if (info.replay) {
      this.replaceState(change.after.state);
      var self = this;
      window.setTimeout(function() {
        if (change.after.surfaceName) {
          var surface = self.surfaces[change.after.surfaceName];
          surface.setSelection(change.after.selection);
        }
      });
    }
  };

  this._onSelectionChanged = function(sel) {
    // var modules = this.getModules();
    this.extensionManager.handleSelectionChange(sel);
    // Notify all registered tools about the selection change (if enabled)
    this.toolManager.updateTools(sel, this.getSurface());
  };

  this._requestAutoSave = function() {
    var doc = this.props.doc;
    var backend = this.context.backend;
    var notifications = this.context.notifications;

    if (doc.__dirty && !doc.__isSaving) {
      notifications.addMessage({
        type: "info",
        message: "Autosaving ..."
      });

      doc.__isSaving = true;
      backend.saveDocument(doc, function(err) {
        doc.__isSaving = false;
        if (err) {
          notifications.addMessage({
            type: "error",
            message: err.message || err.toString()
          });
          console.error('saving of document failed');
        } else {
          doc.emit('document:saved');
          notifications.addMessage({
            type: "info",
            message: "No changes"
          });
          doc.__dirty = false;
        }
      });
    }
  };

  // Surface related
  // ----------------------

  this.registerSurface = function(surface, name, options) {
    name = name || Substance.uuid();
    options = options || {};
    this.surfaces[name] = surface;
    if (surface.name) {
      throw new Error("Surface has already been attached");
    }
    // HACK: we store a name on the surface for later decision making
    surface.name = name;

    // HACK: we store enabled tools on the surface instance for later lookup
    surface.enabledTools = options.enabledTools || [];

    surface.connect(this, {
      'selection:changed': function(sel) {
        this.updateSurface(surface);
        this._onSelectionChanged(sel);
        this.emit('selection:changed', sel);
      }
    });
  };

  this.unregisterSurface = function(surface) {
    Substance.each(this.surfaces, function(s, name) {
      if (surface === s) {
        delete this.surfaces[name];
      }
    }, this);
    surface.disconnect(this);
  };

  this.updateSurface = function(surface) {
    this.activeSurface = surface;
  };

  this.getSurface = function() {
    return this.activeSurface;
  };

  this.getSelection = function() {
    if (!this.activeSurface) return Document.nullSelection;
    return this.activeSurface.getSelection();
  };

  // Checks based on the surface registry if a certain tool is enabled
  this.isToolEnabled = function(toolName) {
    var activeSurface = this.getSurface();
    var enabledTools = activeSurface.enabledTools;
    return _.includes(enabledTools, toolName);
  };

  // Extensions Related
  // ----------------------
  // 
  // Should delegate most work to ExtensionManager
  // Dead code!!
  // 
  // this.getNodeComponentClass = function(nodeType) {
  //   console.log('get node component class', nodeType);
  //   var extensions = this.getConfig().extensions;
  //   var NodeClass;

  //   var components = _.extend({}, coreComponents);

  //   for (var i = 0; i < extensions.length; i++) {
  //     var ext = extensions[i];
  //     if (ext.components && ext.components[nodeType]) {
  //       components[nodeType] = ext.components[nodeType];
  //     }
  //   }

  //   NodeClass = components[nodeType];

  //   if (!NodeClass) throw new Error("No component found for "+nodeType);
  //   return NodeClass;
  // };

  this.getPanels = function() {
    return this.extensionManager.getPanels();
  };

  this.getActivePanelElement = function() {
    return this.extensionManager.getActivePanelElement();
  };

  // Get all available tools from core and extensions
  this.getTools = function() {
    return coreTools.concat(this.extensionManager.getTools());
  };

  this.getActiveContainerAnnotations = function() {
    return this.extensionManager.getActiveContainerAnnotations();
  };

  this.getHighlightedNodes = function() {
    return this.extensionManager.getHighlightedNodes();
  };

  // This belongs to container annotations
  // A higlight is a container annotations fragment
  this.getHighlightsForTextProperty = function(textProperty) {
    var doc = this.doc;
    var container = textProperty.getContainer();

    var highlightsIndex = new Substance.PathAdapter.Arrays();
    if (container) {
      var activeContainerAnnotations = this.getActiveContainerAnnotations();

      _.each(activeContainerAnnotations, function(annoId) {
        var anno = doc.get(annoId);
        if (!anno) return;
        var fragments = container.getAnnotationFragments(anno);
        _.each(fragments, function(frag) {
          highlightsIndex.add(frag.path, new Highlight(frag.path, frag.startOffset, frag.endOffset, {
            id: anno.id, classNames: anno.getClassNames().replace(/_/g, "-")+" annotation-fragment"
          }));
        });
      });

      return highlightsIndex.get(textProperty.props.path) || [];
    } else {
      return [];
    }
  };

  // Document Specific stuff
  // TODO: Move to DocumentController class
  this.deleteAnnotation = function(annotationId) {
    var anno = this.doc.get(annotationId);
    var tx = this.doc.startTransaction({ selection: this.getSelection() });
    tx.delete(annotationId);
    tx.save({ selection: Selection.create(anno.path, anno.startOffset, anno.endOffset) });
  };

  this.annotate = function(annoSpec) {
    var sel = this.getSelection();

    var path = annoSpec.path;
    var startOffset = annoSpec.startOffset;
    var endOffset = annoSpec.endOffset;

    // Use active selection for retrieving path and range
    if (!path) {
      if (sel.isNull()) throw new Error("Selection is null");
      if (!sel.isPropertySelection()) throw new Error("Selection is not a PropertySelection");
      path = sel.getPath();
      startOffset = sel.getStartOffset();
      endOffset = sel.getEndOffset();
    }

    var annotation = Substance.extend({}, annoSpec);
    annotation.id = annoSpec.id || annoSpec.type+"_" + Substance.uuid();
    annotation.path = path;
    annotation.startOffset = startOffset;
    annotation.endOffset = endOffset;

    // start the transaction with an initial selection
    var tx = this.doc.startTransaction({ selection: this.getSelection() });
    annotation = tx.create(annotation);
    tx.save({ selection: sel });

    return annotation;
  };

  this.undo = function() {
    if (this.doc.done.length>0) {
      this.doc.undo();
    }
  };

  this.redo = function() {
    if (this.doc.undone.length>0) {
      this.doc.redo();
    }
  };
};


Substance.initClass(WriterController);
module.exports = WriterController;

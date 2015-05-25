var Substance = require("substance");
var Article = require('../article');
var EXAMPLE_DOC = require("../../data/sample_doc");
var _ = require("substance/helpers");

var Backend = function(opts) {
  this.session = null;

  // Restore last session
  var lastSession = localStorage.getItem('session');
  if (lastSession) {
    this.session = JSON.parse(lastSession);
  }
};

Backend.Prototype = function() {

  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    console.log('opening...', documentId);

    $.ajax({
      type: "GET",
      url: "/api/documents/"+documentId,
      dataType: "json",
      beforeSend: function (xhr) {
        var session = localStorage.getItem('session');
        var token = JSON.parse(session).token;
        xhr.setRequestHeader ("Authorization", "Bearer " + token);
      },
      success: function(rawDoc) {
        var doc = new Article(rawDoc);
        console.log('rawDoc', rawDoc);
        console.log('doc', doc);
        window.doc = doc;
        cb(null, doc);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    });

    // var doc = new Article(EXAMPLE_DOC);
    // cb(null, doc);
  };

  this.createDocument = function(cb) {
    // Talk to server to create a new doc
    $.ajax({
      type: "POST",
      url: "/api/documents",
      dataType: "json",
      beforeSend: function (xhr) {
        var session = localStorage.getItem('session');
        var token = JSON.parse(session).token;

        xhr.setRequestHeader ("Authorization", "Bearer " + token);
      },
      success: function(data) {
        console.log(data);
        cb(null, data);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    });
  };

  this.getDocuments = function(cb) {
    $.ajax({
      type: "GET",
      url: "/api/documents",
      dataType: "json",
      beforeSend: function (xhr) {
        var session = localStorage.getItem('session');
        var token = JSON.parse(session).token;

        xhr.setRequestHeader ("Authorization", "Bearer " + token);
      },
      success: function(data) {
        cb(null, data);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    });
  };

  this.saveDocument = function(doc, cb) {
    //cb(new Error("Saving not supported in dev mode"));
    $.ajax({
      type: "PUT",
      url: "/api/documents/" + doc.id,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(doc.toJSON()),
      beforeSend: function (xhr) {
        var session = localStorage.getItem('session');
        var token = JSON.parse(session).token;

        xhr.setRequestHeader ("Authorization", "Bearer " + token);
      },
      success: function() {
        cb(null);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    });
  };

  // User Session
  // ------------------

  this.authenticate = function(username, password, cb) {
    var self = this;

    $.ajax({
      type: "POST",
      url: "/api/authenticate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({
        "username": username,
        "password": password
      }),
      dataType: "json",
      success: function(data) {
        // NO longer needed to unpack the token
        // var userdata = atob(data.token.split('.')[1]);
        self.session = {
          token: data.token,
          user: data.user
        };

        // Remember session next time
        localStorage.setItem('session', JSON.stringify(self.session));
        cb(null, self.session);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    });
  };

  this.logout = function(cb) {
    this.session = null;
    localStorage.removeItem('session');
    cb(null);
  };

  this.isAuthenticated = function() {
    return !!this.session;
  };

  // Get user information of currently logged in user
  this.getUser = function() {
    return this.session.user;
  };
};

Substance.initClass(Backend);

module.exports = Backend;
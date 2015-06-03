var Substance = require("substance");
var Article = require('../article');
// var EXAMPLE_DOC = require("../../data/sample_doc");
// var _ = require("substance/helpers");

var Backend = function() {
  this.initialized = false;
};

// _request('POST', '/api/authenticate', {username: username, password: password});

Backend.Prototype = function() {

  // A generic request method
  // -------------------
  // 
  // Deals with sending the authentication header, encoding etc.

  this._request = function(method, url, data, cb) {

    var ajaxOpts = {
      type: method,
      url: url,
      contentType: "application/json; charset=UTF-8",
      // data: JSON.stringify(data),
      dataType: "json",
      success: function(data) {
        cb(null, data);
      },
      error: function(err) {
        console.error(err);
        cb(err.responseText);
      }
    };

    if (data) {
      ajaxOpts.data = JSON.stringify(data);
    }

    // Add Authorization header if there's an active session
    var session = localStorage.getItem('session');
    if (session) {
      var token = JSON.parse(session).token;

      ajaxOpts.beforeSend = function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      };
    }

    $.ajax(ajaxOpts);
  };


  // Initialize
  // ------------------

  this.initialize = function(cb) {

    // Restore last session
    var lastSession = localStorage.getItem('session');
    var lastToken;
    if (lastSession) {
      lastToken = lastSession.token;
    }

    this.verifyToken(lastSession, function(err) {
      this.initialized = true;
      if (err) {
        this.destroySession();
        cb(null);
      } else {
        this.session = JSON.parse(lastSession);
        cb(null);
      }
    }.bind(this));
  };

  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    console.log('opening document...', documentId);

    this._request('GET', '/api/documents/'+documentId, null, function(err, rawDoc) {
      if (err) return cb(err);
      var doc = new Article(rawDoc);
      window.doc = doc;
      cb(null, doc);
    });
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
    this._request('GET', '/api/documents', null, cb);    
  };

  this.saveDocument = function(doc, cb) {
    this._request('PUT', '/api/documents/'+doc.id, doc.toJSON(), cb);
  };


  // User Session
  // ------------------

  this.verifyToken = function(token, cb) {
    this._request("GET", "/api/status", null, function(err, result) {
      console.log('token verification', err, result);
      cb(err);
    });
  };

  this.authenticate = function(username, password, cb) {
    var self = this;

    var data = {
      username: username,
      password: password
    };

    this._request('POST', '/api/authenticate', data, function(err, data) {
      if (err) return cb(err);
      self.session = {
        token: data.token,
        user: data.user
      };
      localStorage.setItem('session', JSON.stringify(self.session));

      console.log('YAY');
      cb(null, self.session);
    });
  };

  this.destroySession = function() {
    this.session = null;
    localStorage.removeItem('session');
  };

  this.logout = function(cb) {
    this.destroySession();
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
var Substance = require("substance");
var Article = require('../article');

var Backend = function() {
  this.initialized = false;
};

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


  // Settings
  // ------------------

  // Get journal settings
  this.getSettings = function(cb) {
    this._request('GET', '/api/settings', null, cb);
  };

  this.updateSettings = function(newSettings, cb) {
    this._request('PUT', '/api/settings', newSettings, cb);
  };


  // Document
  // ------------------

  this.getDocument = function(documentId, cb) {
    this._request('GET', '/api/documents/'+documentId, null, function(err, rawDoc) {
      if (err) return cb(err);
      var doc = new Article(rawDoc);
      window.doc = doc;
      cb(null, doc);
    });
  };

  this.deleteDocument = function(documentId, cb) {
    this._request('DELETE', '/api/documents/'+documentId, null, cb);
  };

  this.createDocument = function(cb) {
    this._request('POST', '/api/documents', null, cb);
  };

  this.getDocuments = function(cb) {
    this._request('GET', '/api/documents', null, cb);    
  };

  this.saveDocument = function(doc, cb) {
    this._request('PUT', '/api/documents/'+doc.id, doc.toJSON(), cb);
  };


  // User related
  // ------------------

  this.getUsers = function(cb) {
    this._request('GET', '/api/users', null, cb);
  };

  this.getUser = function(username, cb) {
    this._request('GET', '/api/users/'+username, null, cb);
  };

  this.createUser = function(userData, cb) {
    this._request('POST', '/api/users', userData, cb);
  };

  this.updateUser = function(username, userData, cb) {
    this._request('PUT', '/api/users/'+username, userData, cb);
  };

  this.verifyToken = function(token, cb) {
    this._request("GET", "/api/status", null, function(err, result) {
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
  this.getUserInfo = function() {
    return this.session.user;
  };
};

Substance.initClass(Backend);

module.exports = Backend;
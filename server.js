var http = require('http');
var express = require('express');
var path = require('path');
var Substance = require("substance");
var fs = require('fs');
var ejs = require('ejs');
var path = require("path");
var session = require('express-session');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();
var port = process.env.PORT || 5000;

var db = require("./server/db");
var Document = db.models.Document;
var api = require("./server/api");

var browserify = require("browserify-middleware");

app.set('view engine', 'ejs');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// use static server
app.use(express.static(path.join(__dirname, "public")));

// set apis route
app.use('/api', api);

// error handler
app.use(function (err, req, res, next) {

  // send 401 error if token is invalid
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      message: 'Invalid token.'
    });
  }
});

// Serve app in dev mode
// --------
// 
// TODO: Try this to get rid of browserify-middleware:
// 
// https://github.com/substance/substance/blob/testsuite-and-apidoc/test/serve.js#L10

if (process.env.NODE_ENV !== "production") {

  // Backend
  // --------------------

  app.get('/app.js', browserify('./client/app.js', {cache: false}));

  app.get('/app.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.send(fs.readFileSync('./client/app.css', 'utf8'));
  });

  app.get('/writer.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.send(fs.readFileSync('./node_modules/substance-ui/writer/writer.css', 'utf8'));
  });

  app.get('/writer_extensions.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.send(fs.readFileSync('./client/writer/writer_extensions.css', 'utf8'));
  });

  // Frontend
  // --------------------

  app.get('/reader_app.js', browserify('./client/reader_app.js', {cache: false}));


  app.get('/reader.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.send(fs.readFileSync('./node_modules/substance-ui/reader/reader.css', 'utf8'));
  });

  app.get('/reader_extensions.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.send(fs.readFileSync('./client/reader/reader_extensions.css', 'utf8'));
  });
}

// Expose the backend app
// --------------

app.route('/substance')
  .get(function(req, res, next) {
    res.render('app', {user: req.user});
  });

app.route('/admin')
  .get(function(req, res, next) {
    res.redirect('/substance');    
  });



// Expose the frontend
// --------------

app.route('/')
  .get(api.util.checkAuth, function(req, res, next) {
    var options = {};
    var user = req.user;

    if(_.isUndefined(user)) {
      options.publishedOnly = true;
    }
    Document.find(options, function(err, documents) {
      res.render('index', {
        documents: documents
      });
    });
  });

app.route('/:doc')
  .get(function(req, res, next) {
    res.render('reader_app', {
      user: req.user,
      documentId: req.params.doc
    });
  });

app.listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});


// Export app for requiring in test files
module.exports = app;
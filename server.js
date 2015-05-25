var http = require('http');
var express = require('express');
var path = require('path');
var Substance = require("substance");
var fs = require('fs');
var ejs = require('ejs');
var path = require("path");
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 5000;

var db = require("./server/db");
var Document = db.models.Document;
var api = require("./server/api");

var browserify = require("browserify-middleware");

app.set('view engine', 'ejs');
app.set('db', db);

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
    res.send(fs.readFileSync('./client/writer/writer.css', 'utf8'));
  });

  // Frontend
  // --------------------

  app.get('/reader_app.js', browserify('./client/app.js', {cache: false}));

}

// Expose the backend app
// --------------

// Render app start page

app.route('/')
  .get(function(req, res, next) {
    res.render('app', {user: req.user});
  });

// Expose the reader interface
// --------------

app.route('/reader')
  .get(function(req, res, next) {
    res.render('reader_app', {user: req.user});
  });


app.listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});
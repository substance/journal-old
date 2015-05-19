var http = require('http');
var express = require('express');
var path = require('path');
var Substance = require("substance");
var fs = require('fs');
var ejs = require('ejs');
var path = require("path");
var session = require('express-session');

var app = express();
var port = process.env.PORT || 5000;

var db = require("./server/db");
var Document = db.models.Document;

var browserify = require("browserify-middleware");

// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.methodOverride());

app.set('view engine', 'ejs');
app.set('db', db);

app.use(express.static(path.join(__dirname, "public")));

// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   genid: function(req) {
//     return Substance.uuid() // use UUIDs for session IDs
//   },
//   secret: 'keyboard cat'
// }));

// Serve app in dev mode
// --------
// 
// TODO: Try this to get rid of browserify-middleware:
// 
// https://github.com/substance/substance/blob/testsuite-and-apidoc/test/serve.js#L10

if (process.env.NODE_ENV !== "production") {

  app.get('/app.js', browserify('./client/app.js', {cache: false}));

  app.get('/app.css', function(req, res) {
    var cssFile = [
      fs.readFileSync('./client/app.css', 'utf8'),
      fs.readFileSync('./client/writer/writer.css', 'utf8')
    ].join('\n');

    res.set('Content-Type', 'text/css');
    res.send(cssFile);
  });
}

// Expose the writer
// --------------

// Render app start page

app.route('/')
  .get(function(req, res, next) {
    res.render('app', {user: req.user});
  });


http.createServer(app).listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});
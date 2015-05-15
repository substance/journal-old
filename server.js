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

// console.log('process.argv', process.argv);

if (process.argv[2] === "--seed") {
  console.log('seeding the database')
}

// Document.createSchema(function(err) {
//   console.log('YAY schema created for document');
//   Document.create({some: "data"}, function(err) {
//     console.log('yay created document entry', err);

//     Document.findAll(function(err, docs) {
//       console.log('alldocs', docs);
//     });
//   });
// });

var browserify = require("browserify-middleware");

// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.methodOverride());

app.set('view engine', 'ejs');
app.set('db', db);

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  resave: false,
  saveUninitialized: true,
  genid: function(req) {
    return Substance.uuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}))


// Serve Lens in dev mode
// --------


if (process.env.NODE_ENV !== "production") {
  app.get('/writer/writer.js', browserify('./client/writer/boot.js', {cache: false}));

  app.get('/writer/writer.css', function(req, res) {
    var cssFile = fs.readFileSync('./client/writer/styles/composer.css', 'utf8');
    res.set('Content-Type', 'text/css');
    res.send(cssFile);
  });

  app.get('/app.js', browserify('./client/app.js', {cache: false}));
}


// Expose the writer
// --------------

app.route('/writer')
  .get(function(req, res, next) {
    res.render('writer', {user: req.user});
  });

// Render app start page

app.route('/')
  .get(function(req, res, next) {
    res.render('app', {user: req.user});
  });

// app.use(app.router);

http.createServer(app).listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});
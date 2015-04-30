var http = require('http');
var express = require('express');
var path = require('path');
var Substance = require("substance");
var fs = require('fs');
var ejs = require('ejs');
var path = require("path");


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var browserify = require("browserify-middleware");

passport.use(new LocalStrategy({
    // set the field name here
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    /* get the username and password from the input arguments of the function */
    console.log('loggging in', username, password);
    // query the user from the database
    // don't care the way I query from database, you can use
    // any method to query the user from database
    // User.find( { where: {username: username}} )
    //   .success(function(user){
      
    //     if(!user)
    //       // if the user is not exist
    //       return done(null, false, {message: "The user is not exist"});
    //     else if(!hashing.compare(password, user.password))
    //       // if password does not match
    //       return done(null, false, {message: "Wrong password"});
    //     else
    //       // if everything is OK, return null as the error
    //       // and the authenticated user
    //       return done(null, user);
        
    //   })
    //   .error(function(err){
    //     // if command executed with error
    //     return done(err);
    //   });
    return done(null, {
      id: "michael",
      username: "michael"
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // query the current user from database
  done(null, {
    id: "michael",
    username: "michael",
    name: "Michael Aufreiter"
  });

  // User.find(id)
  //   .success(function(user){
  //       done(null, user);
  //   }).error(function(err){
  //       done(new Error('User ' + id + ' does not exist'));
  //   });
});




var session = require('express-session');




// var CJSServer = require('substance-cjs');

var app = express();
var port = process.env.PORT || 5000;

// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.methodOverride());

app.set('view engine', 'ejs');
// app.set('views', __dirname);

// var config = require("./.screwdriver/project.json");
// new CJSServer(app, __dirname, 'lens')
//   // ATTENTION: the second argument is the script which is resembled by injecting a list
//   // of script tags instead. It must be exactly the same string which is used in the script src.
//   .scripts('./boot.js', 'substance_composer.js', {
//     // ignores: [
//     //   'substance-commander',
//     //   'substance-chronicle',
//     //   'substance-operator'
//     // ]
//   })
//   // ... the same applies to the css file
//   .styles(config.styles, 'composer.css')
//   .page('/', './index.html');


// Serve assets with alias as configured in project.json (~dist like setup)
// Substance.each(config.assets, function(srcPath, distPath) {
//   var absPath = path.join(__dirname, srcPath);
//   var route = "/" + distPath;
//   //console.log("Adding route for asset", route, "->", absPath);
//   if (fs.lstatSync(absPath).isDirectory()) {
//     app.use( route, express.static(absPath) );
//   } else {
//     app.use( route, function(req, res) {
//       res.sendfile(absPath);
//     } );
//   }
// });

app.use(express.static(path.join(__dirname, "public")));

// app.use(express.session());

app.use(session({
  resave: false,
  saveUninitialized: true,
  genid: function(req) {
    return Substance.uuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}))


// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve Lens in dev mode
// --------


// app.get('/', function(req, res) {  
//   res.render('index', { title: 'The index page!' });
// });


app.get('/login', function(req, res) {  
  res.render('login', {
    message: "meeh" // req.flash('loginMessage')
  });
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   // failureRedirect: '/login',
                                   /* failureFlash: true */})
);


console.log('#################', process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  app.get('/writer/writer.js', browserify('./client/writer/boot.js', {cache: false}));

  app.get('/writer/writer.css', function(req, res) {
    var cssFile = fs.readFileSync('./client/writer/styles/composer.css', 'utf8');
    res.set('Content-Type', 'text/css');

    res.send(cssFile);
  });

  app.get('/app.js', browserify('./client/app.js', {cache: false}));

  // app.get('/writer/writer.css', function(req, res) {
  //   var cssFile = fs.readFileSync('./node_modules/substance-writer/styles/composer.css', 'utf8');
  //   res.set('Content-Type', 'text/css');

  //   res.send(cssFile);
  // });
}


// Expose the writer
// --------------

app.route('/writer')
  .get(function(req, res, next) {
    res.render('writer', {user: req.user});
  });

app.route('/')
  .get(function(req, res, next) {
    res.render('app', {user: req.user});
  });

// app.get('/', function(req, res) {
//   res.send('hello world');
// });

// app.use(app.router);

http.createServer(app).listen(port, function(){
  console.log("Lens running on port " + port);
  console.log("http://127.0.0.1:"+port+"/");
});
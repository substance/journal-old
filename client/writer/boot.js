window.devMode = true;

var app = require("./src/app");

$(function() {

  // Create a new Lens app instance
  // --------
  //
  // Injects itself into body

  // launch it
  app.start();
});

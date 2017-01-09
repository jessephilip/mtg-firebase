// import express
var express = require("express");
var app = express();

// import body-parser
var bodyParser = require("body-parser");

// set port for app
var PORT = 9001 || process.env.PORT;

// offer up static files
app.use(express.static("views/assets"));

//use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));

// import html routes
require("./control/routing/html-routes.js")(app);

// import api routes
require("./control/routing/api-routes.js")(app);

// run server
app.listen(PORT, function() {
	console.log("MTG Console listening at http://localhost:" + PORT);
});

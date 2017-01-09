// import path
var path = require("path");

// export function to html routes
module.exports = function(app) {

	// route for the home page
    app.get("/", function(req, res) {
		console.log("'/' reached. Loading mtg.html.");
        res.sendFile(path.join(__dirname + "/../../views/mtg.html"));
    });

	// route for the mtg page
    app.get("/mtg", function(req, res) {
		console.log("'/mtg' reached. Loading mtg.html.");
        res.sendFile(path.join(__dirname + "/../../views/mtg.html"));
    });
};

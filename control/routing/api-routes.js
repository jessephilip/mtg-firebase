// import path
var path = require("path");

// import google-auth-library to authenticate the token received from the client
var GoogleAuth = require('google-auth-library');

// import the client id from keys.js
var keys = require("../../keys.js");

// variables for authenticating the token received from the client
var auth = new GoogleAuth();
var client = new auth.OAuth2(keys.CLIENT_ID, '', '');

// import orm
var orm = require("../orm/firebase-orm.js");

// export function to api routes
module.exports = function(app) {

    // post route for login with google
    app.post("/loginGoogle", function(req, res) {
        // get google sign in token from the client
        var token = req.body.token;
        //console.log(token);

        // authenticate the token received from the client
        client.verifyIdToken(
            token,
            keys.CLIENT_ID,
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
            function(e, login) {
                var payload = login.getPayload();
                //console.log("payload", payload);
                var userid = payload.sub;
                //console.log("userid", userid);
                // If request specified a G Suite domain:
                //var domain = payload['hd'];

                // call orm to log in the user with firebase
                orm.googleSignIn(token, function(success) {
					res.send(success);
				});
            });
    });
};

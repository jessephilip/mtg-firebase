// import firebase
var firebase = require("firebase");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBFJvuE_iTUVOsOnNeD12wEcTS7yphWlag",
    authDomain: "mtghelper-81c74.firebaseapp.com",
    databaseURL: "https://mtghelper-81c74.firebaseio.com",
    storageBucket: "mtghelper-81c74.appspot.com",
    messagingSenderId: "1035011540407"
};
firebase.initializeApp(config);

// variable different aspects of firebase
var auth = firebase.auth();
var database = firebase.database();

// orm to work with firebase authentication and firebase database
var orm = {
    googleSignIn: function(id_token, callback) {

        // display confirmation that googleSignIn function has been reached
        console.log("Logging user in.");

        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

        // Sign in with credential from the Google user.
        auth.signInWithCredential(credential).then(function(user) {

            // console.log to show that this function has been reached
            console.log("Login success for " + user.displayName + ".");

            // grab the useful aspects of the success user object
            user = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                uid: user.uid,
                providerId: user.providerId,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                refreshToken: user.refreshToken
            };

			// split the full name into an array of its parts
			var nameArray = user.name.split(" ");
			//console.log("nameArray", nameArray);

			// save nameArray to the user object
			user.names = nameArray;

			//console.log(user);

			// send user info back to api-routes to go back to the client
			callback(user);

			// add typeObject to the userObject for additional operations
			user.typeObject = "loginObject";

            // display the sorted results to the console
            //console.log("credential success organized", user);

            // write user information to the firebase database
            orm.databaseWrite("users/", user);

            // catch for auth.signInWithCredential
        }).catch(function(error) {
            console.log("auth failed", error);
        });
    },

    // create user from google sign in
    createUser: function(createObject) {

        // display confirmation that this function was reached
        console.log("orm.createUser reached.");

        // variable out the argument object
        var email = createObject.email;
        var password = createObject.password;

        // send email and password to firebase.auth() to create user
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    },

    // this function will log the current user into the database, making him/her an active user
    databaseLogin: function() {

        // display confirmation that this function was reached
        console.log("orm.databaseLogin reached");

    },

    // this function will write to the firebase databaseLogin
    // write object should contain typeObject and user
    databaseWrite: function(location, writeObject) {

        // display confirmation that this function was reached
        console.log("orm.databaseWrite reached");

        // switch to determine where to write to the database
        switch (writeObject.typeObject) {

            // "userObject" will write user details to users/
            case "loginObject":
                // write user info to the database
                database.ref(location + writeObject.uid).set({
                    name: writeObject.name,
                    email: writeObject.email,
                    photo: writeObject.photoUrl
                }).then(function() {
                    console.log("Database updated for " + writeObject.name);
                });
                break;
            default:
                console.log("Switch Error. Check that object sent to databaseWrite has proper typeObject");
        }
    }
};

// export orm
module.exports = orm;

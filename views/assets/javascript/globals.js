// global variables

// shortcuts
var auth = firebase.auth();
var db = firebase.database();

// variable to hold the firebase user information of the current user
var userProfile = {};

// variable to hold the snapshot of firebase.database().ref("games/open").on("value", function(snapshot){});
var opengames;

// firebase listeners
db.ref("games/open").on("value", function(snapshot) {
    opengames = snapshot.val();
    //console.log(opengames);
});

// firebase listeners
db.ref("rolls/").on("value", function(snapshot) {
    var toast = snapshot.val();

    // build out message string from toast object
    var name = toast.user;
    var type = toast.type;
    var result = toast.result;

    // variable to hold the toast message
    var message;

    switch (type) {
        case "coin":
            message = name + " flipped a coin: " + result + ".";
            break;
        case "6":
            message = name + " rolled a D6: " + result + ".";
            break;
        case "20":
            message = name + " rolled a D20: " + result + ".";
            break;
        default:
            message = "Error. Something went wrong.";
    }

    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(message, 4000); // 4000 is the duration of the toast
});

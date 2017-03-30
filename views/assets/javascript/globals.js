// global variables

// constructors

// creates a toast constructor to send to the firebase database
function Toast(gameId, type, result) {
    this.gameId = gameId;
    this.type = type;
    this.result = result;
    this.user = userProfile.name;
    this.time = function() {
        return Date.now();
    };
}

// shortcuts
var auth = firebase.auth();
var db = firebase.database();

// variable to hold the firebase user information of the current user
var userProfile = {};

// variable to hold the snapshot of firebase.database().ref("games/open").on("value", function(snapshot){});
var opengames;

// keypress listeners
$(document).keypress(function(e) {

    var gameId = $("#currentUserId").attr("data-gameId");

    // get the button pressed
    var pressed = e.key;

    // use a switch statement to determine what action to take based on key touch
    switch (pressed) {
        case "2":
            coinFlip(gameId);
            break;
        case "6":
            d6Roll(gameId);
            break;
        case "t" || "T":
            d20Roll(gameId);
            break;
        default:

    }

});

// firebase listeners

// this listener listens for changes in the games/open branch and saves any changes to a global variable opengames
db.ref("games/open").on("value", function(snapshot) {
    opengames = snapshot.val();
    //console.log(opengames);
});

// this listener listens for changes in the rolls/ branch. used for sending toasts to all players
db.ref("rolls/").on("value", function(snapshot) {

    // variable the snapshot from the firebase database
    var toast = snapshot.val();

    // build out message string from toast object
    var name = toast.user;
    var type = toast.type;
    var result = toast.result;
    var sourceGameId = toast.gameId;

    // get control id
    var controlGameId = $("#currentUserId").attr("data-gameId");

    // comparison of sourceGameId and controlGameId to limit the toast to game toasts. Otherwise all toasts from any game anywhere would work.
    if (sourceGameId === controlGameId) {

        // variable to hold the toast message
        var message;

        // switch based on type (which is a string message)
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
    } else {
        console.log("The gameIds do not match. SourceId: " + sourceGameId + ", ControlId: " + controlGameId);
    }
});

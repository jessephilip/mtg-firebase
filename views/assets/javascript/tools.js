// create a toast constructor
function Toast(type, result) {
    console.log(type, result);
    this.type = type;
    this.result = result;
    this.user = userProfile.name;
    this.time = Date.now();
}

// clicklistener for coinFlip button
$("#coinFlip").on("click", coinFlip);

// this function simulates a coin flip
function coinFlip() {
    // variable for result
    var type = "coin";
    var result;

    var math = Math.round(Math.random());
    if (math === 1) result = "Heads";
    else result = "Tails";

    // use the Toast constructor to create a new object toast
    var flip = new Toast(type, result);

    // send toast object to the firebase database
    db.ref("rolls/").set(flip);

}

$("#d6").on("click", d6Roll);

// this function simulates a coin flip
function d6Roll() {

    // variable for result
    var result;

    // variable to tell the type of roll
    var type = "6";

    // roll the die
    var math = Math.floor((Math.random() * 6) + 1);
    result = math;

    // objectify the roll
    var d6 = new Toast(type, result);

    // send toast object to the firebase database
    db.ref("rolls/").set(d6);
}

$("#d20").on("click", d20Roll);

// this function simulates a coin flip
function d20Roll() {

    // variable for result
    var result;

    // variable to tell the type of roll
    var type = "20";

    // roll the die
    var math = Math.floor((Math.random() * 20) + 1);
    result = math;

    // objectify the roll
    var d20 = new Toast(type, result);

    // send toast object to the firebase database
    db.ref("rolls/").set(d20);

}

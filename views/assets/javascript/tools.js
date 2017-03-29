// clicklistener for coinFlip button
$("#coinFlip").on("click", coinFlip);

// this function simulates a coin flip
function coinFlip(keypressGameId) {

	// variable for result
    var type = "coin";
    var result;

	// gameId to know which branch to put the toast in
	var gameId;

	// if variable from button press is present, use that, else use data from DOM
	if (keypressGameId === null) gameId = $(this).attr("data-gameId");
	else gameId = keypressGameId;

	// code to simulate a coin flip
	var math = Math.round(Math.random());
    if (math === 1) result = "Heads";
    else result = "Tails";

    // use the Toast constructor to create a new object toast
    var flip = new Toast(gameId, type, result);
	console.log("flip", flip);

    // send toast object to the firebase database
    db.ref("rolls/").set(flip);

}

$("#d6").on("click", d6Roll);

// this function simulates a coin flip
function d6Roll(keypressGameId) {

    // variable for result
    var result;

    // variable to tell the type of roll
    var type = "6";

	// gameId to know which branch to put the toast in
	var gameId;

	// if variable from button press is present, use that, else use data from DOM
	if (keypressGameId === null) gameId = $(this).attr("data-gameId");
	else gameId = keypressGameId;

    // roll the die
    var math = Math.floor((Math.random() * 6) + 1);
    result = math;

    // objectify the roll
    var d6 = new Toast(gameId, type, result);

    // send toast object to the firebase database
    db.ref("rolls/").set(d6);
}

$("#d20").on("click", d20Roll);

// this function simulates a coin flip
function d20Roll(keypressGameId) {

    // variable for result
    var result;

    // variable to tell the type of roll
    var type = "20";

	// gameId to know which branch to put the toast in
	var gameId;

	// if variable from button press is present, use that, else use data from DOM
	if (keypressGameId === null) gameId = $(this).attr("data-gameId");
	else gameId = keypressGameId;

    // roll the die
    var math = Math.floor((Math.random() * 20) + 1);
    result = math;

    // objectify the roll
    var d20 = new Toast(gameId, type, result);

    // send toast object to the firebase database
    db.ref("rolls/").set(d20);

}

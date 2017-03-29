// initialize side-nav
$('.button-collapse').sideNav();

// initialize modals
$('.modal').modal();
$("#joinGameModal").modal({
    complete: function() {
        $("#openGames").html("");
    }
});

// initialize collapsibles
$('.collapsible').collapsible();
$(document).on("click", ".collapsible-header", function(e) {
    e.preventDefault();
});

// clicking on logo reveals sidebar
$("#logo").on("click", function() {
	if (userProfile.name === undefined) {
		$(".hideable").css("display", "none");
	}
    $('.button-collapse').sideNav('show');
});

// initialize select forms
$('select').material_select();

// clicklistener for signing out with Google
$("#signOut").on("click", signOut);

// TODO: add a page refresh to the sign out
// function to sign out with Google
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
    $(".profileImage").attr("src", "https://placehold.it/50x50");
    $("#mainProfilePic").attr("src", "https://placehold.it/30x30");
    $("#profileName").text("John Doe");
    $("#profileEmail").text("example@gmail.com");

	$(".hideable").css("display", "none");
}

// clicklistener for hosting a new game
$("#hostGame").on("click", hostModal);

// function to pop up host game modal
function hostModal() {
    $('#hostGameModal').modal('open');
}

// clicklistener for joining a game
$("#joinGame").on("click", joinModal);

// function to pop up join game modal
function joinModal() {
    $('#joinGameModal').modal('open');
}

// actions regarding CREATE GAME
$("#hostCreate").on("click", createGame);

// function to perform when create Game button is clicked
function createGame(e) {
    e.preventDefault();

    // get user input from the create game modal
    var gameObject = {
        gameName: $("#gameName").val().trim(),
        gameLife: parseInt($("#gameLife").val().trim()),
        gameNumberPlayers: parseInt($("#gamePlayers").val().trim()),
        gameFormat: $("#gameFormat").val(),
        gamePlaneschase: $("#planeschase").prop("checked"),
        gameArchenemy: $("#archenemy").prop("checked"),
        gameCreater: userProfile
    };

    // clear the user's input on the create game modal
    $("#gameName").val("");
    $("#gameLife").val("");
    $("#gamePlayers").val("");
    //TODO: figure out how to reset the value of a materialize drop down select box and implement it here.
    $("#gameFormat").val("");
    $("#planeschase").prop("checked", false);
    $("#archenemy").prop("checked", false);


    // TODO: Set these defaults up for player setting defaults
    if (!gameObject.gameName) gameObject.gameName = "nameless";
    if (!gameObject.gameLife) gameObject.gameLife = 20;
    if (!gameObject.gameNumberPlayers) gameObject.gameNumberPlayers = 2;
    if (!gameObject.gameFormat) gameObject.gameFormat = "standard";

    // push gameObject to firebase database
    db.ref("games/open").push(gameObject);
}

// clicklistener for when the join game button is pushed
$("#joinGame").on("click", joinGameClick);

// function for when Join Game is clicked
function joinGameClick(e) {
    e.preventDefault();

    // display array of open games
    //console.log(opengames);

    // call the function that creates the cards for open games
    createCards(opengames);
}

// this function handles the array of open games
function createCards(gamesArray) {

    // locator for the location on the DOM
    var openGamesArea = $("#openGames");

    // clear the html of anything that was there before
    openGamesArea.html("");

    //gamesArray is actually an object of many objects so loop through the parent object
    for (var key in gamesArray) {

        // set data to the child object equal to key
        var data = gamesArray[key];

        //console.log("Game: " + key, data);

        // get array of players already in the game
        var gamers = data.gamePlayers;
        //console.log("pre try...catch", gamers);

        // gamePlayers expects an array, but attempting to get the lengh of an empty array breaks the program
        // therefore, try ... catch .length and on error set gamers = none
        var length;
        try {
            length = gamers.length;
            //console.log("length", length);
        } catch (e) {
            length = 0;
        }

        //console.log("try ... catch", gamers);

        // create variable to hold array of players' names
        var names = [];
        if (length === 0) gamers = "none";
        else {
            for (var i = 0; i < length; i++) {
                names.push(gamers[i].player.name);
            }
            // console.log("names", names);
            gamers = names;
        }

        // begin dynamically creating user player card
        var row = $("<div class='row'>");
        openGamesArea.append(row);

        var col = $("<div class='col s12'>");
        row.append(col);

        var card = $("<div class='card blue-grey darken-1'>");
        col.append(card);

        var content = $("<div class='card-content white-text'>");
        card.append(content);

        var title = $("<span class='card-title'>");
        title.text(data.gameName);
        content.append(title);

        var format = $("<p>");
        format.text("Format: " + data.gameFormat);
        content.append(format);

        var life = $("<p>");
        life.text("Starting Life: " + data.gameLife);
        content.append(life);

        var players = $("<p>");
        players.text("Players Joined: " + gamers);
        content.append(players);

        var createdOn = $("<p>");
        createdOn.text("Created On: " + data.createdAt);
        content.append(createdOn);

        var actions = $("<div class='card-action'>");
        card.append(actions);

        var gameButton = $("<a>");
        gameButton.text("Join Game");
        gameButton.addClass('joinGameButton');
        gameButton.attr("data-gameId", key);
        gameButton.attr("data-gameLife", data.gameLife);
        actions.append(gameButton);

        var trashIcon = $("<i>");
        trashIcon.addClass("material-icons right trashIcon");
        trashIcon.css("color", "orange");
        trashIcon.text("delete");
        trashIcon.attr("data-gameId", key);
        actions.append(trashIcon);
    }
}

// clicklistener for Join Game Card Buttons
$(document).on("click", ".joinGameButton", joinGameButtonPress);

// function to add player to game
function joinGameButtonPress() {

    // get the game's ID from data saved in the DOM element
    var gameId = $(this).attr("data-gameId");
    //console.log(gameId);

	// start .on listener for firebase database
	db.ref("games/open/" + gameId + "/gamePlayers").on("child_added", function(snapshot) {
		console.log(".on gamePlayers: ", snapshot);
	});

    // add gameId to coinFlip, d6, and d20 buttons
    $(".tool").attr("data-gameId", gameId);

	addPlayer(gameId);
}

function addPlayer (gameId) {

    // get the games's starting life from data saved in the DOM element
    var gameLife = parseInt($(this).attr("data-gameLife"));
    //console.log(gameLife);

    // create player object to add to gameplayers, an array in the open games section of the database
    var playerObject = {
        player: userProfile
    };

    // make gamelife part of the playerObject
    playerObject.player.gameLife = gameLife;

    // check to see if player is already added to the game
    // first get uid of player being added
    var idCheck = playerObject.player.uid;
    //console.log("idCheck", idCheck);

    // second, get the array of players already in the game
    var players = opengames[gameId].gamePlayers;
    //console.log("opengames[gameId].gamePlayers", players);
    if (!players) players = [];
    //console.log("addPlayerToGame players", players);

    // third, loop through the array of players to compare idCheck to the ids of existing players
    var notAdded = true;
    var pos;

    for (i = 0; i < players.length; i++) {
        if (idCheck === players[i].player.uid) {
            //console.log(i, "match", idCheck);
            notAdded = false;
            pos = i;
        } else pos = 0;
    }

    // if notAdded is true, send the updated players to the database
    if (notAdded) {
        players.push(playerObject);

        // send updated players to the firebase database
        db.ref("games/open/" + gameId).update({
            gamePlayers: players
        });
    }

    // loop through all the players in gamePlayers and create database listeners for changes in their value
    players.forEach(function(element, index) {
        db.ref("games/open/" + gameId + "/gamePlayers/" + index + "/player").on("value", function(snapshot) {

            // update the DOM with the player's new life total
            var hp = snapshot.val().gameLife;
            $("." + element.player.uid + "Life").text(hp);
        });
    });

    // close the modal and sideNav
    $('#joinGameModal').modal('close');
    $('.button-collapse').sideNav('hide');

    // first, create a large card visualizing data regarding the current user
    // 1. clear everything out of mainArea
    var mainArea = $("#mainArea");
    mainArea.html("");

    // 2. create player card for current user sending mainArea as the location to place the card
    revealCard(mainArea, gameId);

    //console.log("userProfile.uid: ", userProfile.uid);

    // 3. use function to create list of players in game other than current user
    var others = otherPlayers(gameId);
    //console.log("others", others);

    // 4. create DOM elements for players other than current user
    createOthersList(others, gameId);

}

// this function creates the collapsible list for the other players in the game
function createOthersList(playerArray, gameId) {

    // display playerArray as confirmation that the function is reached
    //console.log("createOthersList argument:", playerArray);

    // 1. clear everything out of othersList area of the DOM
    var othersArea = $("#othersArea");
    othersArea.html("");

    // loop through playerArray array and create a collapsible for each object in the array
    for (i = 0; i < playerArray.length; i++) {
        // variable other is for simplifying access to array
        var other = playerArray[i];
        //console.log("other", other);

        // begin dynamically creating cards
        var row = $("<div class='row'>");
        othersArea.append(row);

        // put user's name on collapsible header
        var horizontalCard = $("<div class='card horizontal opponentCard'>");
        row.append(horizontalCard);

        // div for card Image
        var cardImage = $("<div class='card-image'>");
        horizontalCard.append(cardImage);

        // put user's profile image on collapsible header
        var otherPic = $("<img>");
        otherPic.prop("src", other.player.photoUrl);
        otherPic.prop("alt", other.player.uid + " Profile Image");
        otherPic.addClass('tinypic');
        cardImage.append(otherPic);

        // div for the card-stacked class
        var cardStacked = $("<div class='card-stacked'>");
        horizontalCard.append(cardStacked);

        // main content area for the card
        var cardContent = $("<div class='card-content'>");
        cardStacked.append(cardContent);

        // put user's name on collapsible header
        var otherName = $("<h4>");
        otherName.text(other.player.name);
        otherName.addClass("otherName");
        cardContent.append(otherName);

        // put user's current life on collapsible header
        var otherLife = $("<h5>");
        otherLife.text(other.player.gameLife);
        otherLife.addClass("otherLife");
        otherLife.addClass(other.player.uid + "Life");
        cardContent.append(otherLife);

        // this is the series of links at the bottom of the card (being used for life buttons)
        var stickyAction = $("<div class='card-action'>");
        cardStacked.append(stickyAction);

        var minusOneButton = $("<a class='waves-effect waves-red lifeClick'>");
        minusOneButton.text("-1");
        minusOneButton.attr("value", -1);
        minusOneButton.attr("data-uid", other.player.uid);
        minusOneButton.attr("data-gameId", gameId);
        stickyAction.append(minusOneButton);

        var minusFiveButton = $("<a class='waves-effect waves-red lifeClick'>");
        minusFiveButton.text("-5");
        minusFiveButton.attr("value", -5);
        minusFiveButton.attr("data-uid", other.player.uid);
        minusFiveButton.attr("data-gameId", gameId);
        stickyAction.append(minusFiveButton);

        var plusOneButton = $("<a class='waves-effect waves-green lifeClick'>");
        plusOneButton.text("+1");
        plusOneButton.attr("value", 1);
        plusOneButton.attr("data-uid", other.player.uid);
        plusOneButton.attr("data-gameId", gameId);
        stickyAction.append(plusOneButton);

        var plusFiveButton = $("<a class='waves-effect waves-green lifeClick'>");
        plusFiveButton.text("+5");
        plusFiveButton.attr("value", 5);
        plusFiveButton.attr("data-uid", other.player.uid);
        plusFiveButton.attr("data-gameId", gameId);
        stickyAction.append(plusFiveButton);
    }
}

// this function creates a materialize reveal card
function revealCard(location, gameId) {

    // variable out the firebase game object with the gameId passed as an argument to make access to the actual playerObject easier
    var game = opengames[gameId];
    //console.log("current game", game);

    var gamePlayers = game.gamePlayers;
    //console.log("gamePlayers", gamePlayers);

    // the current user's current game life
    var gameLife;

    // get life of current user for this game
    for (var i = 0; i < gamePlayers.length; i++) {
        if (gamePlayers[i].player.uid === userProfile.uid) {
            gameLife = gamePlayers[i].player.gameLife;
        }
    }

    //console.log("gameLife", gameLife);

    // this div is for the entire card
    var divCard = $("<div class='card sticky-action medium'>");
    location.append(divCard);

    // this div is for the main image on the card
    var divCardImage = $("<div class='card-image waves-effect waves-block waves-light'>");
    divCard.append(divCardImage);

    var imgActivator = $("<img class='activator'>");
    imgActivator.attr("src", "../images/mtgbackground.jpg");
    divCardImage.append(imgActivator);

    // this div is for the content on the card
    var divCardContent = $("<div class='card-content'>");
    divCard.append(divCardContent);

    // spanCardTitle displays the current user's name
    var spanCardTitle = $("<span class='card-title activator grey-text text-darken-4'>");
    spanCardTitle.text(userProfile.name);
    divCardContent.append(spanCardTitle);

    // this is the vertical three dot icon that reveals the panel onclick
    var moreVert = $("<i class='material-icons right'>");
    moreVert.text("more_vert");
    spanCardTitle.append(moreVert);

    var lifeDiv = $("<div>");
    divCardContent.append(lifeDiv);

    var lifeTotal = $("<h4 class='lifeTotal'>");
	lifeTotal.attr("id", "currentUserId");
    lifeTotal.attr("data-gameId", gameId);
    lifeTotal.addClass(userProfile.uid + "Life");
    lifeTotal.text(gameLife);
    lifeDiv.append(lifeTotal);

    // this is the series of links at the bottom of the card (being used for life buttons)
    var stickyAction = $("<div class='card-action valign-wrapper life-action'>");
    divCard.append(stickyAction);

    var minusOneButton = $("<a class='lifeButton waves-effect waves-red lifeClick'>");
    minusOneButton.text("-1");
    minusOneButton.attr("value", -1);
    minusOneButton.attr("data-uid", userProfile.uid);
    minusOneButton.attr("data-gameId", gameId);
    stickyAction.append(minusOneButton);

    var minusFiveButton = $("<a class='lifeButton waves-effect waves-red lifeClick'>");
    minusFiveButton.text("-5");
    minusFiveButton.attr("value", -5);
    minusFiveButton.attr("data-uid", userProfile.uid);
    minusFiveButton.attr("data-gameId", gameId);
    stickyAction.append(minusFiveButton);

    var plusOneButton = $("<a class='lifeButton waves-effect waves-green lifeClick'>");
    plusOneButton.text("+1");
    plusOneButton.attr("value", 1);
    plusOneButton.attr("data-uid", userProfile.uid);
    plusOneButton.attr("data-gameId", gameId);
    stickyAction.append(plusOneButton);

    var plusFiveButton = $("<a class='lifeButton waves-effect waves-green lifeClick'>");
    plusFiveButton.text("+5");
    plusFiveButton.attr("value", 5);
    plusFiveButton.attr("data-uid", userProfile.uid);
    plusFiveButton.attr("data-gameId", gameId);
    stickyAction.append(plusFiveButton);

    var divCardReveal = $("<div class='card-reveal'>");
    divCard.append(divCardReveal);

    var spanRevealTitle = $("<span class='card-title grey-text text-darken-4'>");
    spanRevealTitle.text(userProfile.name);
    divCardReveal.append(spanRevealTitle);

    var closeIcon = $("<i class='material-icons right'>");
    closeIcon.text("close");
    spanRevealTitle.append(closeIcon);

    var infoP = $("<p>");
    infoP.text("Here is some more information about this product that is only revealed once clicked on.");
    divCardReveal.append(infoP);

}

// onclick listener for trash game button
$(document).on("click", ".trashIcon", closeGame);

// this function "trashes" a game e.g. changes its status from open to closed
function closeGame() {

    // get gameID from an element of the DOM
    var gameId = $(this).attr("data-gameId");
    //console.log("gameId", gameId);

    // close the game by reading the snapshot of the game, setting it to games/closed and removing the game in games/open
    // 1. read the value of the game at the gameId and get the snapshot of that game
    db.ref("games/open/" + gameId).once("value").then(function(snapshot) {

        // display the value of the snapshot
        //console.log(snapshot.val());

        // 2. write the snapshot to games/closed
        db.ref("games/closed/" + gameId).set(snapshot.val(), function() {

            // 3. delete the game at the gameId in games/open
            db.ref("games/open/" + gameId).remove();

            // run the createCards function to repopulate the list of open games
            createCards(opengames);

            // after closing a game, if there are no open games, close the join game modal
            if (opengames === null) $('#joinGameModal').modal('close');
        });

        // error code if the copy and delete procedure fails
    }).catch(function(error) {
        console.log("Attempt to get the snapshot of gameId " + gameId + " failed.");
    });
}


// onclick listener for lifebuttons
$(document).on("click", ".lifeClick", lifeChange);

// this function performs an ajax call
// what to know to change life: amount, gameId, and player uid
function lifeChange() {

    // get necessary values from the DOM
    // TODO: go back, and instead of saving everything on every button, get values from other elements on the DOM
    var gameId = $(this).attr("data-gameId");
    var playerUid = $(this).attr("data-uid");
    var amount = parseInt($(this).attr("value"));
    //console.log("gameId: " + gameId + ", playerUID: " + playerUid + ", amount: " + amount);

    // get current life of player from firebase database
    db.ref("games/open/" + gameId).once("value").then(function(snapshot) {

        // variable snapshot.val().gamePlayers as a shortcut
        var players = snapshot.val().gamePlayers;

        // loop through players array to get the index number of the pertinent player
        for (var i = 0; i < players.length; i++) {

            // shortcut variable
            var gamer = players[i];

            // if playerUid matches, then i is the index of the pertinent player
            if (playerUid === gamer.player.uid) {

                // get the current life total of the pertinent player
                var currentLife = gamer.player.gameLife;

                // calculate the new life total for the pertinent player
                currentLife += amount;

                // build the locatio string for the firebase database
                var location = "games/open/" + gameId + "/gamePlayers/" + i + "/player";

                db.ref(location).update({
                    gameLife: currentLife
                });
            }
        }
        // error handling for the database read
    }).catch(function(error) {
        console.log("update life error", error);
    });
}

// function to filter out current user from list of gamePlayers in the active gamePlayers
function otherPlayers(gameId) {

    // get pertinent game from opengames using gameId
    var game = opengames[gameId];

    // get array of player objects
    var allPlayers = game.gamePlayers;

    // loop through array to remove the current user's element
    for (var i = 0; i < allPlayers.length; i++) {
        //console.log("allPlayers" + i + ".player.uid: ", allPlayers[i].player.uid);
        if (allPlayers[i].player.uid === userProfile.uid) {
            allPlayers.splice(i, 1);
        }
    }

    // display results
    console.log("spliced allPlayers: ", allPlayers);

    // return results
    return allPlayers;
}

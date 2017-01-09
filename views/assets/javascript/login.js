// function that runs on "/" loadup and logs in the user through google sign in
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id = profile.getId();
    var name = profile.getName();
    var photo = profile.getImageUrl();
    var email = profile.getEmail();
    var token = googleUser.getAuthResponse().id_token;
	//console.log(id);

    // prepare loginObject to send through ajax
    var loginObject = {
        token: token
    };

    // prepare url for ajax call
    var currentURL = window.location.origin;

    // ajax call sending token to the server for firebase authentication
    $.ajax({
            url: currentURL + '/loginGoogle',
            type: 'POST',
            data: loginObject
        })
        .done(function(success) {

			// make the verified user returned from the server a global variable
			userProfile = success;
			//console.log(userProfile);

			$(".profileImage").attr("src", userProfile.photoUrl);
			$("#profileName").text(userProfile.name);
			$("#profileEmail").text(userProfile.email);

        })
        .fail(function(fail) {
            console.log("/loginGoogle error", fail);
        });
}

// var counts = 0;
//
// firebase.database().ref("counts/").on("value", function(snapshot) {
// 	//console.log(snapshot.val());
// 		$("#count").text(snapshot.val().counter);
// });
//
// $("#counter").on("click", function() {
// 	counts++;
// 	$("#count").text(counts);
// 	firebase.database().ref("counts/").set({
// 		counter: counts
// 	});
// });

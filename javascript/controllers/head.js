angular.module('mtg').controller('HeadController', function($scope) {

	// variable to hold the scope
	let head = $scope;

	// scope of this controller
	head.scope = 'Head Scope';

	// title for the browser tab
	head.title = 'MTG AngularJS';

});

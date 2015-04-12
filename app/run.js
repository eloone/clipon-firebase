(function(angular){

	angular.module('clipon', ['firebase', 'clipon.connect.controllers.connect'])
	.config(['$locationProvider', function($locationProvider){
		$locationProvider.html5Mode(true);
	}])
	.constant('dbRoot', 'https://clipon.firebaseio.com');

}(window.angular));

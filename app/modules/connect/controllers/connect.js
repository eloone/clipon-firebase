(function(angular){
	angular.module('clipon.connect.controllers.connect', ['clipon.input.directives.input'])
	.controller('cliponConnectCtrl', cliponConnectCtrl);

	function cliponConnectCtrl($scope, $firebaseObject, $firebaseArray, $log, $location, dbRoot) {
		var randomID = (Math.random()+1).toString(36).substring(7);
    	var path = $location.path();

	    if(path !== '/' + randomID && path === '/'){
	        $location.path(randomID);
	        path = $location.path();
	    }

		// Initiate connection to websockets
		connect();

		/* Functions * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// Monitor connected state to Firebase
		// This makes sure the app continuously works even when connection is interrupted
		function connect(){
			// Connect to Firebase's magic hidden path
			var dbConnectedState = new Firebase(dbRoot + '/.info/connected');

			dbConnectedState.on('value', onConnected);

			function onConnected(snaphot){
				if (snaphot.val() === true) {
			  	// When connected proceed with authentication
			    auth();

			    $log.info('I/O connected');
			  } else {
			    $log.info('I/O not connected');
			  }
			}

		}

		// Authenticate the current connection to identify it on Firebase
		function auth() {
			var dbUrlPaths = new Firebase(dbRoot + '/url-paths/' + getPath(path));
			var oldSession = dbUrlPaths.getAuth();

			if(oldSession) {
				dbUrlPaths.unauth();
			}

			dbUrlPaths.authAnonymously(function(err, session) {
			  if (err) return $log.error(err);

			  $log.info('logged in');

			  // Once authenticated start everything
			  startApp(session, function() {
			  	// Clean old session
			  	if(oldSession){
			  		var allUsers = new Firebase(dbRoot + '/users/all/' + getPath(path) + '/' + oldSession.uid);
			  		allUsers.remove();
			  		$log.info('ready');
			  	}
			  });

			}, { remember: 'sessionOnly' });
		}

		// Start application
		function startApp(session, callback) {
			var dbUrlPaths = new Firebase(dbRoot + '/url-paths/' + getPath(path));
			var connectedUser = new Firebase(dbRoot + '/users/connected/' + getPath(path) + '/' + session.uid);
			var allUsers = new Firebase(dbRoot + '/users/all/' + getPath(path) + '/' + session.uid);

			// Add this user to all the users of this url path
			allUsers.set(getPath(path), function() {
				// Set the user as connected
				connectedUser.set(getPath(path), function(err) {

				// Synchronize Firebase object with angular scope
				// with this magic mystic object
				$firebaseObject(dbUrlPaths).$bindTo($scope, 'clipboard');
				// Synchronize users
				$scope.users = $firebaseArray(connectedUser.parent());

				$log.info('synced');

				connectedUser.onDisconnect().remove();

				function onDisconnect(v) {
					if(v.key() === session.uid && v.val() === null) {
						// Cancel event listeners for all firebase objects on disconnect
						// angularfire $destroy should do that but it doesn't -_-
						// otherwise when it reconnects the listeners execute with old data
						// which makes some security rules not work
						// and angularfire doesn't make the errors catchable yet 0_0
						connectedUser.off('value', onDisconnect);
						connectedUser.parent().off();
						dbUrlPaths.off();
					}
				};

				connectedUser.on('value', onDisconnect);

				if (callback) callback();

				});

			});

			$scope.urlPath = path;

		}

		// Replace slashes with anti-slashes in the path
		// This is a hack to allow saving the path with a unique hash key
		// A key can't have slashes in Firebase --> 0_0 i found the edge case !!
		function getPath(path) {
			return path.replace(/^\/|\/$/, '').replace(/\//g, '\\');
		}

	}

}(window.angular));
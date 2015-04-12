(function(angular){
	angular.module('clipon.input.directives.editable', [])
	.directive('cliponEditable', cliponEditable);

	function cliponEditable($timeout){
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, elt, attrs, ngModel){
				var isTyping = false;
				var timeout;

				attrs.$observe('cliponEditable', function(value){
					if(value){
						elt.attr('contenteditable', true);
					} else {
						elt.attr('contenteditable', false);
					}
				});

		 		ngModel.$render = function() {
		 			if(isTyping) return;
		        	elt.html(ngModel.$viewValue);
		        };

		        elt.on('click', function(e){
					elt.attr('contenteditable', true);
					e.target.focus();
					scope.$digest();
				});

				elt.on('keydown', function(){
					isTyping = true;
					scope.$digest();
				});

				elt.on('keyup', function(){
					ngModel.$setViewValue(elt.html());

					if(!isTyping) return;

					$timeout.cancel(timeout);

					// Wait 15s before updating isTyping
					// to avoid sudden view render while the user is typing
					// because it will reset the caret position
					timeout = $timeout(function(){
						isTyping = false;
					}, 15000);

					scope.$digest();
				});
			}
		}
	}

}(window.angular));
(function(angular){
	angular.module('clipon.input.directives.input', ['clipon.lib.services.utils', 'clipon.input.directives.editable'])
	.directive('cliponInput', cliponInput)
	.directive('formatContent', formatContent);

	function formatContent($utils){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elt, attrs, ngModel){

				function format(value){
					if(!value) return '';
					return $utils.formatInput(value);
				}

				// At every change of the model the input is
				// formatted and cleaned from unwanted spaces/tags etc.
				ngModel.$parsers.push(format);
			}
		};
	}

	function cliponInput($utils, $location, $timeout){
		return {
		  restrict: 'E',
	      scope: {
	      	content: '='
	      },
	      templateUrl: !$utils.isContentEditable() ?
	       '/modules/input/directives/input.html' :
	       '/modules/input/directives/input-contenteditable.html',
	      link: function(scope, elt){
	      	var input = document.getElementById('input');

	      	scope.editing = false;
	      	scope.fullUrl = $location.absUrl();

	      	scope.hasContent = function(){
	      		return !!scope.content;
	      	};

	      	// editing mode is set by on-focus and on-blur events
	      	scope.$watch('editing', function(value){
	      		if(value){
	      			// If <a> are present replace them with plain urls
	      			if(/<a/ig.test(scope.content)){
                		scope.content = $utils.disableLinks(scope.content);
            		}
	      		} else if(value === false){
	      			// If urls are present replace them with html clickable links
	      			if($utils.detectUrls(scope.content) && $utils.isContentEditable()){
                    scope.content = $utils.enableLinks(scope.content);
                    $utils.makeLinksClickable(input);
                	}
	      		}
	      	});

	      	// Focus on input instead of placeholder
	      	scope.transferFocus = function(){
	      		scope.editing = true;
	      		$timeout(function(){
	      			input.focus();
	      		});
	      	};

	      	// Init content at page load
	      	scope.$watch('::content', function(value){
	      		if(!value) return;
	      		scope.content = $utils.formatInput(value);
	      	});

	      }
		};
	}

}(window.angular));
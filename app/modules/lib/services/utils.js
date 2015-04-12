(function(angular){
	angular.module('clipon.lib.services.utils', [])
	.factory('$utils', cliponUtils);

	function cliponUtils(){
		function utils(){

			this.isContentEditable = function(){
				return ('contentEditable' in document.documentElement);
			}

			this.enableLinks = function enableLinks(text) {

		        var exp = /(<a.*href="[^"']*"[^>]*>\s*)?(href=")?(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(<\/a>)?/ig;

		        return text.replace(exp, function(match, $1, $2, $3, $4){
		            if(!$1 && !$2 && !$4){
		                return '<a href="'+$3+'" target="_blank">'+$3+'</a>';
		            }else{
		                return match;
		            }
		        });
		    };

		    // Replaces links with plain urls
		    this.disableLinks = function disableLinks(text){

		        var exp = /<a(.*)href\s*=\s*"?'?([^'"]*)"?'?[^>]*>(.*)<\/a>/ig;

		        return text.replace(exp, '$2');
		    };

		    this.detectUrls = function detectUrls(text){

		        var exp = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		        return exp.test(text);
		    };

		    // Make sure links are clickable
		    this.makeLinksClickable = function clickableContentLinks(inputElt){
		        var children = inputElt.childNodes;

		        for (var i = children.length - 1; i >= 0; i--) {
		            if(children[i].tagName == 'A'){
		                children[i].onclick = function(e){
		                    e.cancelBubble = true;
		                }
		            }
		        };
		    };

		    this.formatInput = function formatInput(text){
		        if(this.isContentEditable()){
		            // Replaces text line breaks by html line breaks
		            text = text.replace(/\n/ig, '<br/>');

		        }else{
		            // Replaces table columns tags by spaces to keep the table readable
		            text = text.replace(/(<\/(td|th)[^>]*>)|(\s+)/ig, ' ');
		            // Replaces html line breaks and block-level html tags by text line breaks
		            text = text.replace(/(<br\s*\/?>\s*)|(<\/(div|p|table|ul|tr)[^>]*>)/ig, '\n');
		            // Removes all the remaining closing tags from the text
		            text = stripTags(text);
		        }

		        // Removes any line break present at the beginning of the text
		        text = text.replace(/^\s*\n*/ig, '');

		        return trimSpace(text);
		    };

		    function stripTags(text){
		        return text.replace(/(<([^>]+)>)/ig,"");
		    }

		    function trimSpace(text){
		    	var trimmedText = text.trim();
		    	var clearedText = trimmedText.replace(/\s|&nbsp;|<br\/?>|\r|\n/g, '');
		    	clearedText = stripTags(clearedText);

		    	if(clearedText === ''){
		    		return clearedText;
		    	}

		    	return text;
		    };

		}

		return new utils();
	}

}(window.angular));
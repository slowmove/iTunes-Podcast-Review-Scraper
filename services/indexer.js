var request = require('request');
var _ = require('underscore');
var config = require('config');

module.exports = (function(){	
	
	var indexReviews = function(lang, podcastId, callback) {		
		var endpoint = "https://itunes.apple.com/"+ lang +"/rss/customerreviews/id="+ podcastId +"/sortBy=mostRecent/json";
		request(endpoint, function (error, response, body) {
			if (!error && response.statusCode == 200) {			    	
				var jsonObj = JSON.parse(body);
				if(jsonObj.feed != null) {						
					var entries = jsonObj.feed.entry;
					if(entries != null) {
						entries.splice(0,1);				
						callback(entries);
					}
				}
		  	}
		});			
	};	
	
	return {
		indexReviews: indexReviews
	}
})();
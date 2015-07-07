var request = require('request');
var database = require('database/db');

module.exports = (function(){
	var collection = database.mongodb.get('podcasts');
	
	var searchPodcast = function(term, callback) {
		var endpoint = 'https://itunes.apple.com/search?entity=podcast&term=' + encodeURIComponent(term);
		console.log(endpoint);
		request(endpoint, function (error, response, body) {
			if (!error && response.statusCode == 200) {			    					
				var data = JSON.parse(body);
				var results = data.results != null ? data.results : [];
				callback(results);
		  	}
		});			
	};
	
	var addPodcast = function(id, name, callback) {
		var indexer = require('services/indexer');
		indexer.startJob(id);
		
		var entry = {
			podcastId: id,
			label: name	
		};
		collection.update({
			podcastId: id
		}, entry, {
			upsert: true
		});
		
		callback();
	};
	
	var getPodcasts = function(callback) {				
		collection.find({},{}, function(e, docs){			
			callback(docs);
		});
	};
	
	return {
		searchPodcast: searchPodcast,
		addPodcast: addPodcast,
		getPodcasts: getPodcasts
	}
})();
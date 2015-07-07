var request = require('request');
var _ = require('underscore');
var config = require('config');
var database = require('database/db');

var currentPage = 1;
var endPage = 999;

module.exports = (function(){	
	var podcastRepository = require('repositories/podcastRepository');
	var languages = config.application.languages;
	var collection = database.mongodb.get('reviews');
	
	/**
	 * Start the indexing job
	 */
	var startJob = function() {
		console.log("Starting job");
		/**
		 * Get the available podcasts from database
		 */
		podcastRepository.getPodcasts(function(podcasts) {
			console.log("Found "+ podcasts.length + " podcasts");
			/**
			 * iterate thru them to fetch reviews for each one
			 */
			podcasts.forEach(function(podcast) {
				/**
				 * for each podcast we have to check each language in config
				 */
				languages.forEach(function(lang) {
					console.log("Indexing " + podcast.podcastId + " on " + lang);
					/**
					 * call the indexer
					 */
					indexReviews(lang, podcast.podcastId);
				});				
			});	
		});
	};
	
	var indexReviews = function(lang, podcastId, callback) {		
		/**
		 * Get the items with current page in pagination, first time 1
		 */
		getItems(lang, podcastId, currentPage);
	};
	
	var getItems = function(lang, podcastId, page) {
		/**
		 * Build url with the parameters sent in, for pagination and languague magic
		 */
		var endpoint = "https://itunes.apple.com/"+ lang +"/rss/customerreviews/page="+page+"/id="+ podcastId +"/sortBy=mostRecent/json";
		console.log(endpoint);		
		request(endpoint, function (error, response, body) {
			//console.log(error);
			//console.log(response);
			//console.log(body);
			if (!error && response.statusCode == 200) {			    	
				var jsonObj = JSON.parse(body);
				if(jsonObj.feed != null) {	
					/**
					 * If response check which is the last page for the pagination
					 */
					setLastPage(jsonObj, function(){						
						var entries = jsonObj.feed.entry;
						if(entries != null) {
							entries.splice(0,1);		
							console.log(entries.length + " items for " + lang);
							/**
							 * Save the entries
							 */		
							saveItems(entries, podcastId, lang);
						}
					});									
				}
		  	}
		});			
	};
	
	var saveItems = function(entries, podcastId, lang) {
		/**
		 * Iterate thru the entries and add some custom meta for easier search
		 */
		_.each(entries, function(entry) {
			entry.podcastId = podcastId;
			entry.id = entry.id.label;
			entry.locale = lang.toLowerCase();
			/**
			 * Update if exists, otherwise insert
			 */
			collection.update({
				id: entry.id
			}, entry, {
				upsert: true
			});
		});	
		
		/**
		 * Add to the pagination and call getItems once more with the new page
		 */
		if(currentPage < endPage) {
			console.log("Page " + currentPage+1 + " of " + endPage);
			currentPage++;
			getItems(lang, podcastId, currentPage+1);
		}
		/**
		 * If the current page is the same as the last, we're done
		 */
		if(currentPage == endPage) {
			console.log("indexing finished for " + lang);
		}
	};
	
	var setLastPage = function(jsonObj, callback) {
		var links = jsonObj.feed.link;
		for (var i = 0; i < links.length; i++) {
			var link = links[i]['attributes'];
			var rel = link['rel'];
			var href = link['href'];
			
			// Find the last page number
			if (rel == 'last') {
				var urlSplit = href.split('/');
				for (var index = 0; index < urlSplit.length; index++) {
					var currentUrlPart = urlSplit[index];
					if (currentUrlPart.substring(0, 5) == 'page=') {
						var lastPage = currentUrlPart.replace('page=', '');
						endPage = lastPage;										
						callback();
					}
				}
			}
		}
	};
	
	return {
		startJob: startJob
	}
})();
var _ = require('underscore');

var database = require('database/db');

module.exports = (function(){
	var collection = database.mongodb.get('reviews');
	
	var getReviews = function(podcastId, callback) {						
		collection.find({
			podcastId: podcastId
		},{}, function(e, docs) {						
			callback(docs);
		});
	};
	
	var getReviewsByCountry = function(podcastId, country, callback) {	
		collection.find({ 
			podcastId: podcastId,
			language: country 
		}, {}, function(e, docs) {
			callback(docs);
		});
	};
	
	var countReviews = function(podcastId, callback) {
		collection.count({
			podcastId: podcastId
		}, function(e, count) {
			callback(count);
		});
	};
	
	var indexReviews = function(podcastId, callback) {
		var indexerService = require('services/indexer');
		var config = require('config');	
		var languages = config.application.languages;		
		_.each(languages, function(lang) {
			indexerService.indexReviews(lang, podcastId, function(reviews){
				_.each(reviews, function(review) {
					review.podcastId = podcastId;
					review.id = review.id.label;
					review.locale = lang;
					collection.update({
						id: review.id
					}, review, {
						upsert: true
					});
				});								
			});							
		});		
		callback();		
	};
	
	return {
		getReviews: getReviews,
		getReviewsByCountry: getReviewsByCountry,
		countReviews: countReviews,
		indexReviews: indexReviews
	}
})();
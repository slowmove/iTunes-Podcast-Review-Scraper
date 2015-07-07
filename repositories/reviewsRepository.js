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
	
	return {
		getReviews: getReviews,
		getReviewsByCountry: getReviewsByCountry,
		countReviews: countReviews
	}
})();
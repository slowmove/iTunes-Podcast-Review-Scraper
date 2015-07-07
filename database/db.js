module.exports = (function(){
	var mongo = require('mongodb'),
		monk = require('monk'),
		mongodb = monk('localhost:27017/itunesReviews');
		
	return {
		mongodb: mongodb
	}
})();


var database = require('database/db');

module.exports = (function(){
	var getPodcasts = function(callback){		
		var collection = database.mongodb.get('podcasts');
		collection.find({},{}, function(e, docs){			
			callback(docs);
		});
	};
	
	return {
		getPodcasts: getPodcasts
	}
})();
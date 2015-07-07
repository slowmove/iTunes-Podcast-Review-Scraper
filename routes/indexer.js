module.exports = function(app) {
	var reviewsRepository = require('repositories/reviewsRepository');

    app.get('/podcast/:id/index', function(req, res){		
		var podcastId = req.params.id;	
		console.log("indexera: "+podcastId);	
		reviewsRepository.indexReviews(podcastId, function(data){
			reviewsRepository.countReviews(podcastId, function(count) {
				res.send("I index för "+podcastId+" är nu: "+count);	
			});			
		});	   
    });
}
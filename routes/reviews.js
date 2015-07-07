module.exports = function(app) {
	var reviewsRepository = require('repositories/reviewsRepository');

    app.get('/podcast/:id/reviews', function(req, res){
		var podcastId = req.params.id;		
		reviewsRepository.getReviews(podcastId, function(){
			res.send(reviews);
			/*res.render('../views/reviews.twig', {
				reviews: reviews
			}); */
		});		     
    });
}
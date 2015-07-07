module.exports = function(app) {
	var reviewsRepository = require('repositories/reviewsRepository');
	var podcastRepository = require('repositories/podcastRepository');

	/**
	 * Shows reviews for a single podcast by id
	 */
    app.get('/podcast/:id/reviews', function(req, res){
		var podcastId = req.params.id;		
		reviewsRepository.getReviews(podcastId, function(reviews){
			//res.send(reviews);
			res.render('../views/reviews.twig', {
				podcastReviews: reviews
			}); 
		});		     
    });
	
	/**
	 * Index a specific podcast
	 */
	 app.get('/podcast/:id/:name/index', function(req, res) {
		 var podcastId = req.params.id;
		 var label = req.params.name;
		 
		 podcastRepository.addPodcast(podcastId, label, function(){
			 res.redirect('/');
		 });
	});
}
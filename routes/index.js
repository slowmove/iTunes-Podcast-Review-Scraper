module.exports = function(app) {
	var podcastRepository = require('repositories/podcastRepository');

	/**
	 * The main route, listing the availale podcasts
	 */
    app.get('/', function(req, res){		
		podcastRepository.getPodcasts(function(availablePodcastReviews){
			res.render('../views/index.twig', {
				podcasts: availablePodcastReviews
			}); 
		});		     
    });
}
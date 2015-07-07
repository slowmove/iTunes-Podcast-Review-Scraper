module.exports = function(app) {
	var podcastRepository = require('repositories/podcastRepository');

    app.get('/', function(req, res){		
		podcastRepository.getPodcasts(function(availablePodcastReviews){
			res.render('../views/index.twig', {
				podcasts: availablePodcastReviews
			}); 
		});		     
    });
}
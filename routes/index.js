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
	
	/**
	 * The route that receives the search query from the form on the start page
	 */
	app.get('/search', function(req, res) {
		var searchParameter = req.query.search;
		podcastRepository.searchPodcast(searchParameter, function(searchResult) {
			res.render('../views/search.twig', {
				podcasts: searchResult
			});
		});
	});
}
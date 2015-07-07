process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

var express = require('express'),
    fs = require('fs'),
    twig = require('twig'),
    _ = require('underscore'),
    db = require('database/db');

var config = require('config');

/**
 * Make it possible to start with process arguments from terminal
 * If we set --indexer, start the indexing
 */
var startIndexerService = process.argv.indexOf('--indexer') > -1 ? true : false;
if(startIndexerService) {
    var indexerService = require('services/indexer');
    indexerService.startJob();
} else {
    /**
     * Start App Server
     */
    var app = express();
    
    var server = app.listen(config.businesslayer.port, function () {
      	var host = server.address().address;
      	var port = server.address().port;
      	console.log('Review Business Layer application listening at http://%s:%s', host, port);
    });
    
    /**
     * Register Routes Folder For Including New Routes
     */
    fs.readdir('./routes', function(err, files){
        files.forEach(function(fn) {
            if(!/\.js$/.test(fn)) return;
            require('routes/' + fn)(app);
        });
    });
    
    module.exports = app;
}
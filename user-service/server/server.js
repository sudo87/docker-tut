// server.js

var express = require('express');
var morgan = require('morgan');

module.exports.start = (options) => {

    return new Promise((resolve, reject) => {

        // make sure we have a repo and port provided.
        if(!options.repository) throw new Error("A server must be started with connected repository.");
        if(!options.port) throw new Error("A server must be started with port.");


        // Create an app and add some logging
        var app = express();
        app.use(morgan('dev'));
        
        // Add the APIs to the app.
        require('../api/users')(app, options);

        // Start the app, creating running server which we return.
        var server = app.listen(options.port, () => {
            resolve(server);
        });
    });
};


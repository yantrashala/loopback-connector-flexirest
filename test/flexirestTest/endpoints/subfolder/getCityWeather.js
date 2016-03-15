'use strict';

exports.errorHandler = function(err,body,response,callback){
    console.log('getCityWeather errorHandler called');

    if(!err) {
        if(!body.query.results) {
            err = new Error('No results found');
            err.statusCode = 404;
        }
    }
    callback(err,body,response);
};

exports.outgoingTransform = function(parameters){
    console.log('getCityWeather outgoingTransform called');
    return parameters;
};

exports.incomingTransform = function(body){
    console.log('getCityWeather incomingTransform called');
    return body;
};

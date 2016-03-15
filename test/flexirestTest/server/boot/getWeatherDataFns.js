// Example file to show how to add Transformers to
// outgoing request and incoming response

module.exports = function(server) {

    addTransforFns(server);
};

var addTransforFns = function(app, config) {
    var getWeatherData = app.models.weather.getWeatherData;

    var outgoingTransformFn = function(parameters) {
        // changing parameter to boston
        parameters.city = 'boston';
        return parameters;
    };

    // removing response
    var incomingTransformFn = function(body) {
        return body.query.results;
    };

    getWeatherData.outgoingTransform = outgoingTransformFn;
    getWeatherData.incomingTransform = incomingTransformFn;
}

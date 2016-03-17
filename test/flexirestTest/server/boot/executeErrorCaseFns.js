// Example file to show how to add Transformers to
// outgoing request and incoming response

module.exports = function(server) {

    addErrorHandler(server);
};

var addErrorHandler = function(app, config) {
    var executeErrorCase = app.models.weather.executeErrorCase;

    var customErrorHandler = function(err,body,response,cb) {
        if(err) {
            var newerror = new Error('Some custom error occured');
            newerror.statusCode = '500';
            newerror.code = 'CUS100';
            cb(newerror,body,response);
        } else {

            if(typeof body !== 'object' ||
            !body.query.results) {
                err = new Error('No results found');
                err.statusCode = 404;
            }

            cb(err,body,response);
        }
    }

    executeErrorCase.errorHandler = customErrorHandler;
}

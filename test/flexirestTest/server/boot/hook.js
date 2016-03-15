module.exports = function(server) {

    loadHooks(server)


};

var loadHooks = function(app, config) {
    var models = app.models();
    models.forEach(function (Model) {



        var connector = Model.getDataSource().connector;

        var name = Model.getDataSource().settings.name;
        var type = connector.dataSource.name || '';

        connector.observe('before execute', function(ctx, next) {

            // request , req
            console.log('before execute');
            next();
        });

        connector.observe('after execute', function(ctx, next) {

            // request, req, res
            console.log('after execute');
            next();
        });

        connector.observe('before outgoingTransform', function(ctx, next) {

            // ctx - name, parameters
            console.log('before outgoingTransform');
            next();
        });

        connector.observe('after outgoingTransform', function(ctx, next) {

            // ctx - name, parameters
            console.log('after outgoingTransform');
            next();
        });

        connector.observe('before incomingTransform', function(ctx, next) {

            // ctx - name, response, body
            console.log('before incomingTransform');
            next();
        });

        connector.observe('after incomingTransform', function(ctx, next) {

            // ctx - name, response, body
            console.log('after incomingTransform');
            next();
        });
    });
};

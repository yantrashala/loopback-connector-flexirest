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
    });
};

'use strict';
var debug = require('debug')('loopback:connector:flexirest');
var RestConnector = require('loopback-connector-rest');
var path = require('path');
var walk = require('./lib/walk');
var transformerLib = require('./lib/transformer');

/**
 * Export the initialize method to loopback-datasource-juggler
 * @param {DataSource} dataSource The loopback data source instance
 * @param {function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
    var settings = dataSource.settings || {};
    var endpointPath = settings.path || 'endpoints';
    var baseURL = settings.baseURL || settings.restPath || 'http://localhost:3000/';

    // load endpoints folder and add to operations for loopback-connector-rest
    if (endpointPath) {
       var endpointTemplates = walk(path.resolve(endpointPath),'json');

       settings.operations = [];
       endpointTemplates.forEach(function(templateFile){

           debug('Found JSON file', templateFile);
           var defintion = require(templateFile);
           defintion.file = templateFile;

           if(defintion && defintion.template && defintion.functions) {
               // file is a template json file
               debug('Adding template to settings.operations');

               if (baseURL) {
                   defintion.template.url = baseURL + defintion.template.url;
               }

               settings.operations.push(defintion);
           }
       });
   }

   RestConnector.initialize(dataSource, callback);
   applyTransformerPatch(dataSource);
   autoloadFunctions(dataSource);
};

var applyTransformerPatch = function(dataSource) {

    var dao = dataSource.connector.DataAccessObject;
    var connector = dataSource.connector;

    Object.keys(dao).filter(function(key){
        return key !== 'invoke';
    }).forEach(function(key){
        var originalfn = dao[key];
        debug('patched function', key);

        var argsList = originalfn.accepts.map(function(param){
            return param.arg;
        });

        var newfn = function(){

            var self = this;
            var context = {'name':key};
            var cb = null;
            if (arguments.length > 0
                    && 'function' === typeof arguments[arguments.length - 1]) {
                cb = arguments[arguments.length - 1];
            }

            context.parameters = {};
            var argsLength = arguments.length;

            Array.prototype.slice.call(arguments)
            .filter(function(arg,index){
                // to avoid callback being added to
                // parameters
                return index < (argsLength -1);
            })
            .forEach(function(arg,index){
                context.parameters[argsList[index]] = arg;
            })

            function outgoingTransform(context, done) {

                if(self[key].outgoingTransform) {
                    debug('outgoingTransform called');
                    var transformedOutput = null;
                    try {
                        transformedOutput = self[key].outgoingTransform(context.parameters);

                        if(typeof transformedOutput !== 'object')
                            done(new Error('transformedOutput is not an object'));

                        Object.keys(context.parameters).filter(function(property){
                            return !transformedOutput.hasOwnProperty(property);
                        }).forEach(function(property){
                            transformedOutput[property] = context.parameters[property];
                        });

                        context.parameters = transformedOutput;
                        done();
                    } catch (e) {
                        done(e);
                    }
                } else {
                    done();
                }
            }

            function errorHandler(err, body, response,done) {

                if(self[key].errorHandler) {
                    debug('errorHandler called');
                    self[key].errorHandler(err, body, response, done);
                } else {
                    done(err, body, response);
                }
            }

            function incomingTransform(context, done) {

                if(self[key].incomingTransform) {
                    debug('incomingTransform called');
                    try {
                        context.body = self[key].incomingTransform(context.body);
                    } catch (e) {
                        done(e);
                    }
                }
                done(null, context.body, context.response);
            }

            connector.notifyObserversAround('outgoingTransform', context, outgoingTransform, function(err) {

                //TODO: fix it properly
                if(err)
                    return cb(err);

                context.parameters = argsList.map(function(property){
                    return context.parameters[property];
                });

                var callback = function(err, body, response) {
                    errorHandler(err,body,response,function(err,body,response){
                        if(err) {
                            cb(err, body, response);
                        } else {
                            delete context.parameters;
                            context.body = body;
                            context.response = response;
                            connector.notifyObserversAround('incomingTransform', context, incomingTransform, function(err, body, response){
                                cb(err, body, response);
                            });
                        }
                    });
                }

                context.parameters.push(callback);
                originalfn.apply(this, context.parameters);
            });
        };

        ['accepts','returns','shared','http'].forEach(function(prop){
            newfn[prop] = originalfn[prop];
        });

        dao[key] = newfn;
    });
};

var autoloadFunctions = function(dataSource) {

    var dao = dataSource.connector.DataAccessObject;
    var functionList = ['errorHandler','incomingTransform','outgoingTransform'];

    var transformer = null;
    if(dataSource.settings.transformer && dataSource.settings.transformer.library
    && dataSource.settings.transformer.ext){
        transformer = transformerLib(dataSource.settings.transformer.library);
    }

    dataSource.settings.operations.forEach(function(defintion){
        functionList.forEach(function(name){
            var handlerString = defintion[name];
            if(handlerString) {
                var handler = null;
                // check if template is used for transformation. Only for
                // incoming and outgoing tranformation with transformer defined
                if(name !== 'errorHandler'&& transformer
                && handlerString.indexOf(dataSource.settings.transformer.ext) !== -1) {
                    var templateFile = path.join(path.dirname(defintion.file),
                        handlerString);
                    handler = transformer.createFunction(templateFile);
                    debug('loading file for transformation',templateFile);
                } else {
                    handler = loadHandler(path.dirname(defintion.file),
                         handlerString);
                }

                if(handler) {
                    for (var f in defintion.functions) {
                        debug('autoloading function',name,'for',f);
                        dao[f][name] = handler;
                    }
                }
            }
        });

        if(defintion.hasOwnProperty('shared')) {
            var sharedFlag = defintion['shared'];
            for (var f in defintion.functions) {
                debug('marking function', f ,' with shared flag as',sharedFlag);
                dao[f]['shared'] = sharedFlag;
            }
        }
    });
};

var loadHandler = function(dir, handlerString) {
    var filename = handlerString.split('.')[0];
    var functionName = handlerString.split('.')[1];

    var fn = null;
    try {
        fn = require(path.join(dir,filename))[functionName];
    } catch(e) {
        //ignore the error and dont load the function
    }
    return fn;
};

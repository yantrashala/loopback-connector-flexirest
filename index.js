'use strict';
var debug = require('debug')('loopback:connector:flexirest');
var RestConnector = require('loopback-connector-rest');
var requiredir = require('require-dir');
var path = require('path');

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
       var endpointDefinitions = requiredir(path.resolve(endpointPath));
       settings.operations = [];

       Object.keys(endpointDefinitions).forEach(function (key) {
           if (typeof endpointDefinitions[key] === 'object') {

               var requireObj = endpointDefinitions[key];
               if (requireObj['operation'] && typeof requireObj['operation'] === 'function') {
                   var fn = requireObj['operation'];
               } else {
                   settings.operations.push(requireObj);
               }
           }
       });
   }

   RestConnector.initialize(dataSource, callback);
};

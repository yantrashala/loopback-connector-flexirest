'use strict';
var fs = require('fs');
var debug = require('debug')('loopback:connector:flexirest');

module.exports = function(library) {

    debug('Loading transformation library', library);
    var lib = null;
    try {
        lib = require(path.resolve(library));
    } catch (e){}
    if(!lib)
        lib = require(library);

    // check if the lib has compile method
    if(!lib.compile)
        throw new Error('Configured library', library,'does not expose the',
        'expected compile method');

    var templateCache = {};
    var transformer = {
        'createFunction' : function(filename){
            if(templateCache[filename])
                return templateCache[filename];
            var template = fs.readFileSync(filename);
            var compiledFn = lib.compile(template.toString());

            var transform = function(input) {
                var output = compiledFn(input);
                return JSON.parse(output);
            }

            templateCache[filename] = transform;
            return transform;
        }
    };
    return transformer;
}

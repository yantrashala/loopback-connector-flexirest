'use strict';

var fs = require('fs');
var path = require('path');

var walk = module.exports = function(dir,extType) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir,file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file,extType));
        }
        else {
            if(extType) {
                if('.'+ extType.toLowerCase() === path.extname(file).toLowerCase()) {
                    results.push(file);
                }
            } else {
                results.push(file);
            }
        }
    });
    return results;
};

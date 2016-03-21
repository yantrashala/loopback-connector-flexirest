'use strict';

var fs = require('fs');
var path = require('path');

var walk = module.exports = function(dir,extType) {

    var list = null;
    var results = [];
    if(!dir)
      return null;

    try {
        list = fs.readdirSync(dir);
    } catch (e){
      return null;
    }

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

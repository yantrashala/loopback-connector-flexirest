'use strict';

var handlebars = require('handlebars');

handlebars.registerHelper('safeString', function(text) {
        console.log('safeString called');
        text = text.replace(/"/g, '\\"');
        text = text.replace(/\n/g, '');
        return new handlebars.SafeString(text);
    });

module.exports = handlebars;

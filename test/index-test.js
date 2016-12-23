'use strict';
var server = require('./flexirestTest/server/server');
var expect = require('chai').expect;
var chai = require('chai')
    .use(require('chai-http'));

describe('Server should start', () => {
    it('should return models', (done) => {
     return chai.request(server)
         .get('/')
         .then(res => {
             expect(res).to.have.status(200);
             done();
         });
    });
});

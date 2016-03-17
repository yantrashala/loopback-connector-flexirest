var chai = require('chai');
var expect = chai.assert;
var app = require('./flexirestTest/server/server');
var supertest = require('supertest');
var api = supertest('http://localhost'+':'+app.get('port'));

describe('Server should start', function() {

  it('Check for server status', function(done) {
    api.get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

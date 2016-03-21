var chai = require('chai');
var assert = chai.assert;
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

describe('weatherDS should load', function() {

  it('weatherDS has loaded', function(done) {
    assert.isNotNull(app.datasources.weatherDS, 'Datasource weatherDS is available')
    done();
  });
});

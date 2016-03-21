var chai = require('chai');
var assert = chai.assert;
var transformerLib = require('../../lib/transformer');
var path = require('path');


describe('transformer', function() {

  it('called with no parameters', function() {
    var lib = '';
    var transformer = transformerLib();
    assert.isNull(transformer, 'transformer is null')
  });
});

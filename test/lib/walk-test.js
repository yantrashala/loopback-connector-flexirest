var chai = require('chai');
var assert = chai.assert;
var walk = require('../../lib/walk');
var path = require('path');


describe('walk', function() {

  it('called with no parameters', function() {
    var dir = '';
    var output = walk();
    assert.isNull(output, 'output is null')
  });

  it('called with invalid directory', function() {
    var dir = 'no_existing';
    var output = walk(dir,'json');
    assert.isNull(output, 'output is null')
  });

  it('called with valid directory', function() {
    var dir = path.resolve('test/fixtures/walk');
    var output = walk(dir);
    assert.isNotNull(output, 'output is not null')
  });

  it('called with valid directory, load only JSON', function() {
    var dir = path.resolve('test/fixtures/walk');
    var output = walk(dir,'json');
    assert.isNotNull(output, 'output is not null')
  });

});

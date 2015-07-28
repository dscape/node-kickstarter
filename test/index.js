'use strict';

var test  = require('tape');
var kickstarter = require('../lib');

test('kickstarter should have a start method', function(assert) {
  assert.equal(typeof kickstarter.start, 'function');
  assert.end();
});

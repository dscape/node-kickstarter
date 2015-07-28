'use strict';

var async = require('async');
var project = require('./project');

exports.start = function(opts, cb) {
  var thisProject = project(opts);

  async.series([
    thisProject.createDirectory,
    thisProject.templatePackageJSON
  ], function(err) {
    if (err) {
      return cb(err);
    }

    console.log('Don\'t forget to edit the README.md and package.json files.' +
      'Have a lot of fun!');
  });
};

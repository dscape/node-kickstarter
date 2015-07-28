'use strict';

var fs = require('fs');
var util = require('util');

var wrench = require('wrench');
var gituser = require('git-user');
var debug = require('debug')('kickstart:lib:project');

module.exports = function(opts) {
  var project = {};

  project.createDirectory = function(cb) {
    debug('Creating project directory at '  + opts.target);

    //
    // sudo npm install -g nd
    // nd wrench
    // (for docs)
    //
    wrench.mkdirSyncRecursive(opts.target);
    wrench.copyDirSyncRecursive(opts.template, opts.target,{
      forceDelete: true,
      excludeHiddenUnix: false,
      preserveFiles: true,
      preserveTimestamps: false
    });

    cb();
  };

  project.templatePackageJSON = function() {
    gituser.nameAndEmail(function(git) {
      debug(git);

      var data = require(opts.packageJSON);

      data.name = opts.projectName;
      data.author = util.format('%s <%s>', git.name, git.email);

      if (!data.contributors) {
        data.contributors = [];
      }

      data.contributors[0] = {
        'name': git.name,
        'email': git.email
      };

      fs.writeFileSync(opts.packageJSON, JSON.stringify(data, null, 4));

    });
  };

  return project;
};

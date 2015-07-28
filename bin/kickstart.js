#!/usr/bin/env node
'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var extend = util._extend;

var readline = require('readline');
var minimist = require('minimist');
var debug = require('debug')('kickstart:bin');
var kickstart = require('../lib');
var defs = require('../defaults');

function usage() {
  console.log([
    'Usage: kickstart target-directory [--options]',
    'Bootstraps your application using a template',
    '',
    '--template       name of your template (default: `' +
      defs.template + '`)',
    '--template-dir   your templates directories (default: `' +
      defs['template-dir'] + '`)',
    '--target         the target directory (default: `' +
      defs.target + '`)'
  ].join(os.EOL));
  process.exit();
}

var opts = minimist(process.argv.slice(2));
opts.directory = process.argv[2];

if (opts.help || opts.h) {
  usage();
}

opts.argv = opts;
opts = extend(defs, opts);
opts.projectName = path.basename(opts.target);
opts.template = path.join(__dirname, '..', 'templates', opts.template);
opts.packageJSON = path.join(opts.template, 'package.json');

if (opts.directory) {
  opts.target = path.join(opts.target, process.argv[2]);
}

Object.keys(opts).map(function(prop) {
  return debug(prop + ': ' + opts[prop]);
});

if (!fs.existsSync(opts.template)) {
  console.log('Directory does not exist ' + opts.template);
  usage();
}

if (!fs.existsSync(opts.packageJSON)) {
  console.log('Could not find `package.json` in ' + opts.template);
  usage();
}

if (fs.existsSync(opts.target)) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(util.format('Overwrite %s? y/N', opts.target), function(answer) {
    if (answer.toLowerCase() !== 'y') {
      console.log('Aborted due to user input');
      usage();
    }
  });
}

kickstart.start(opts, function(err) {
  if (err) {
    throw err;
  }
});

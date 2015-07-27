/// <reference path="../typings/tsd.d.ts" />
"use strict"
var options = require('node-options')
    , path = require('path')
    , fs = require('fs')
    , Q = require('q');

var templates = require("./templates")
    , project = require("./project");

function startProject() {
    
    var opts = {
        "template":"default"  
    };
    
    var deferred = Q.defer(),
        result = options.parse(process.argv.slice(2)),
        targetDirectory = process.cwd();    
       
    // resolve directory for project
    if (result.args.length > 0) {
        targetDirectory = path.join(targetDirectory, result.args[0]);  
    }

    // resolve template to use
    templates.resolveTemplate(opts.template)
        .then(project.create.bind(project,targetDirectory))
        .then(project.renderPackage)
        .then(function(){
            console.log("Don't forget to edit the README.md and package.json files. Have a lot of fun!");
            deferred.resolve();
        })
        .catch(function(err){
            deferred.reject(err);            
        })
        .done();

    return deferred.promise;    
}

exports.startproject = startProject;

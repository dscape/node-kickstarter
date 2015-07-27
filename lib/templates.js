/* global __filename */
"use strict"
var path = require('path')
    , fs = require('fs')
    , Q = require("q");

var templatesDir = path.join(path.dirname(fs.realpathSync(__filename)), '../share/templates');
 
function resolve(template) {
    
    var deferred = Q.defer(),
        templateDir = path.join(templatesDir,template);
    
    fs.exists(templateDir,function(exists) {
       
        if (exists) {

            console.log("Using template found at %s",templateDir);
            deferred.resolve(templateDir);

        } else {

            deferred.reject(new Error("No template named " + template));

        }

    });
    
    return deferred.promise;
}

exports.resolveTemplate = resolve;
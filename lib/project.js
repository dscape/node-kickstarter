"use strict"
var path = require('path')
    , fs = require('fs')
    , util = require("util")
    , readline = require("readline")
    , wrench = require('wrench')
    , Q = require("q")
    , gituser = require("git-user")
    ;

function renderPackageJs(dst) {
    
    var deferred = Q.defer(),
        packageJS = path.join(dst,"package.json"),
        projectName = path.basename(dst);
    
    fs.exists(packageJS,function(exists){
       
       if (!exists) {
           console.log("WARNING: package.js not found for this template.")
           deferred.resolve(dst);
           return;
       }

        gituser.name(function(err,name){
           
            if (err) {
                deferred.reject(new Error(err));
                return;
            }
    
            gituser.email(function(err,email){
                if (err) {
                    deferred.reject(new Error(err));
                    return;
                }
                                               
                try {
                    
                    var data = JSON.parse(fs.readFileSync(packageJS,"utf8"));
                    
                    data.name = projectName;
                    data.author = util.format("%s <%s>",name,email);
                    
                    if (!data.contributors)
                        data.contributors = [];
                        
                    data.contributors[0] = {
                        "name":name,
                        "email":email
                    };
                                         
                    fs.writeFileSync(packageJS,JSON.stringify(data,null,4));
                    
                    deferred.resolve(dst);

                }
                catch (err) {
                    deferred.reject(err);
                }

            });
            
        });

       
    });
    
    return deferred.promise;
        
}

function createProject(dst,template) {
    
    var deferred = Q.defer();
    
    fs.exists(template,function(exists) {
        
        if (!exists) {
            
            deferred.reject(new Error("No template directory found at " + template));
            
        } else {

            var createProjectDir = function() {
                
                console.log("Creating project directory at %s",dst);
                wrench.mkdirSyncRecursive(dst);
    
                wrench.copyDirSyncRecursive(template,dst,{
                    forceDelete: true, //keep the target directory if it already exists
                    excludeHiddenUnix: false, //also copy hidden files
                    preserveFiles: true, //don't touch/destroy anything in the target directory
                    preserveTimestamps: false //don't screw around with project dates
                });
        
                deferred.resolve(dst);
                
            };
            
            if (fs.existsSync(dst)) {
                
                var rl = readline.createInterface({
                    "input" : process.stdin,
                    "output" : process.stdout
                });
                
                rl.question(util.format("Overwrite %s? y/N ",dst), function(answer) {

                   if (answer.toLowerCase() == "y") {
                       
                       createProjectDir();
                       
                   } else {
                       
                       deferred.reject(new Error("Aborted."));
                       
                   }
                    
                });
                
            } else {
                
                createProjectDir();
                
            }
                        
        } 

    });
    
    return deferred.promise;
}

exports.create = createProject;
exports.renderPackage = renderPackageJs;
/*
 * Default routes
 */
var nconf = require('nconf');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var request = require('request');
var FeedParser = require('feedparser');

var validate = require('jsonschema').validate;
var cfgschema = require('./../../config/schema.json');

nconf.use('file', { file: __dirname+'/../../config/config.json' });
nconf.load();
//https://api.travis-ci.org/repositories/jupe/home.js.json
 
exports.configure = function(req, res){
  
  res.json( nconf.get() );
}
function iterateUpdates(obj, key) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object"){
        iterateUpdates(obj[property], (key?(key+':'+property):property));
      } else {
        key = key+':'+property;
        nconf.set(key, obj[property]);
      }
    }
  }
}

exports.update = function(req, res){
  
  if( validate(req.body, cfgschema ).errors.length == 0 ) {
    //avoid push invalid configurations.
    iterateUpdates(req.body);
    nconf.save(function (err) {
      if (err) {
        winston.error(err.message);
        res.json(500, {error: err});
        return;
      }
      winston.log('Configuration saved successfully.');
      res.json(nconf.get());
    });
  } else {
    res.json(400 , nconf.get() );
  }
}
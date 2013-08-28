var fs = require('fs'),
    hoard = require("hoard");

var TimeSeries = function(dir){
  
  this.basedir = dir;
  
  var getFile = function(uuid){
    return this.basedir+'/'+uuid+'.hoard';
  }
  var hoardExist = function(uuid){
    return fs.existsSync( getFile(uuid) ) 
  }
  
  var getHoard = function(uuid){
    if( hoardExist(uuid ) {
      return getFile(uuid);
    } return false;
  }
  var newHoard = function(uuid, cfg, callback){
    var filename = getFile(uuid);
    try {
      hoard.create(filename, cfg.archives, cfg.period, function(err) {
        if (err){
          callback(err);
        } else {
          callback(null, {filename: filename, uuid: uuid, cfg: cfg});  
        }
      });
    }catch(e){
      callback(e);
    }
  }
  
  return {
    get: getHoard,
  }
}

module.exports = TimeSeries;
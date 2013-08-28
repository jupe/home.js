var fs = require('fs'),
    hoard = require("hoard");

var TimeSeries = function(dir){
  
  var basedir = dir;
  
  var getFile = function(uuid){
    return basedir+'/'+uuid+'.hoard';
  }
  var hoardExist = function(uuid){
    return fs.existsSync( getFile(uuid) ) 
  }
  
  var getHoard = function(uuid){
    if( hoardExist(uuid ) ) {
      return getFile(uuid);
    } return false;
  }
  var newHoard = function(cfg, callback){
    var filename = getFile(cfg.uuid);
    if( hoardExist(cfg.uuid) ) {
      callback({msg: 'already exists', filename: filename});
      return;
    }
    try {
      hoard.create(filename, cfg.archives, cfg.period, function(err) {
        if (err){
          callback(err);
        } else {
          callback(null, {filename: filename, cfg: cfg});  
        }
      });
    }catch(e){
      callback(e);
    }
  }
  var update = function(cfg, callback){
    hoard.update(getFile(cfg.uuid), cfg.data, function(err) {
        callback(err);
    });
  }
  var unixTime = function(date) {
    if( date ) return parseInt(date.getTime() / 1000);
    return parseInt(new Date().getTime() / 1000);
  };
  var fetch = function(cfg, callback) {
    try{
      hoard.fetch(getFile(cfg.uuid), unixTime(cfg.from), unixTime(cfg.to), 
        function(err, timeInfo, values) {
          if (err) {
            callback(err);
          } else {
            callback( null, 
              { timeInfo: {
                from: new Date(timeInfo[0]*1000), 
                to: new Date(timeInfo[1]*1000), 
                interval: timeInfo[2]*1000
              }, 
              values: values }
            );
          }
        }
      );
    } catch(e){
      console.log('fetch-throw');
      callback(e);
    }
  }
  return {
    get: getHoard,
    create: newHoard,
    update: update,
    fetch: fetch,
  }
}

module.exports = TimeSeries;


/* TEST */
var db = new TimeSeries('./hoards');
/*
db.create( {uuid: '123', archives: 
                  [  [60*5,  12*24],     // meas/5min  1 days
                     [60*10, 12*24*7],  // meas/10min  7 days
                     [60*60, 24*365*50] // meas/1h    50 year
                  ], period: 0.5 //0.5s interval
           }, function(err, obj){
  if(err)console.log(err);
  else console.log(obj);
});

db.update({uuid: '123', data: [[stamp, 123]]}, function(err) {
    if (err) throw err;
    console.log('Hoard file updated!');
}); 
console.log( db.get('123') ); 
*/
db.fetch({uuid: '123', from: new Date(Date.Now-10000), to: new Date()}, function(err, data){
  if(err) {
    console.log('error');
    console.log(err);
    
  }
  else console.log(data);
});


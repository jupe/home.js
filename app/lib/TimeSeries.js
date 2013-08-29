var fs = require('fs')
  , util = require("util")
  , events = require("events")
  , hoard = require("hoard");

var TimeSeries = function(config){
  
  var basedir = config.dir;
  
  //be sure that base folder exists
  if( !fs.existsSync(basedir) ){
    fs.mkdirSync(basedir);
  }
  
  events.EventEmitter.call(this);
  
  var getFile = function(id){
    var filename = basedir+'/'+id+'.hoard';
    return filename;
  }
  var hoardExist = function(id){
    return fs.existsSync( getFile(id) ) 
  }
  
  var getHoard = function(id){
    if( hoardExist(id ) ) {
      return getFile(id);
    } return false;
  }
  var removeHoard = function(id){
    if( hoardExist(id) ){
      return fs.unlinkSync( getFile(id) );
    }
  }
  var getInfo = function(id, callback){
    if( !hoardExist(id) ){
      callback({error: 'file not exists'});
      return;
    }
    try {
      hoard.info(getFile(id), callback);
    } catch(e) { callback(e); }
  }
  var newHoard = function(cfg, callback){
    var filename = getFile(cfg.id);
    if( hoardExist(cfg.id) ) {
      callback({msg: 'already exists', filename: filename});
      return;
    }
    try {
      hoard.create(filename, cfg.archives, cfg.period, 0.5,  function(err) {
        if (err){
          callback(err);
        } else {
          callback(null, {filename: filename, cfg: cfg});  
        }
      });
    } catch(e) {
      callback(e);
    }
  }
  var update = function(cfg, callback){
    var i;
    /*for(i=0;i<cfg.data.length;i++){
      cfg.data[i][0] = unixTime(cfg.data[i][0]);
    }*/
    console.log(cfg);
    try {
      hoard.update(getFile(cfg.id), cfg.data, function(err) {
          callback(err);
      });
    } catch(e){
      callback(e);
    }
  }
  var updateMany = function(cfg, callback){
    var i;
    /*for(i=0;i<cfg.data.length;i++){
      cfg.data[i][0] = unixTime(cfg.data[i][0]);
    }*/
    console.log(cfg);
    try {
      hoard.updateMany(getFile(cfg.id), cfg.data, function(err) {
        callback(err);
      });
    } catch(e){
      callback(e);
    }
  }
  var firstDayOfWeek = function(week, year) { 
      if (typeof year !== 'undefined') {
        year = (new Date()).getFullYear();
    }

    var date       = firstWeekOfYear(year),
        weekTime   = weeksToMilliseconds(week),
        targetTime = date.getTime() + weekTime - 86400000;

    var result = new Date(targetTime)

    return result; 
  }
  var lastDayOfWeek = function(week, year) { 
      var first = firstDayOfWeek(week, year);
      return first + (1000 * 60 * 60 * 24 * 7);
  }
  var weeksToMilliseconds = function(weeks) {
     return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
  }
  var firstWeekOfYear = function(year) {
    var date = new Date();
    date = firstDayOfYear(date,year);
    date = firstWeekday(date);
    return date;
  }
  var firstDayOfYear = function(date, year) {
      date.setYear(year);
      date.setDate(1);
      date.setMonth(0);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
  }
  /**
   * Sets the given date as the first day of week of the first week of year.
   */
  var firstWeekday = function(firstOfJanuaryDate) {
      // 0 correspond au dimanche et 6 correspond au samedi.
      var FIRST_DAY_OF_WEEK = 1; // Monday, according to iso8601
      var WEEK_LENGTH = 7; // 7 days per week
      var day = firstOfJanuaryDate.getDay();
      day = (day === 0) ? 7 : day; // make the days Monday-Sunday equals to 1-7 instead of 0-6
      var dayOffset=-day+FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
      if (WEEK_LENGTH-day+1<4) {
          // the current week has not the minimum 4 days required by iso8601 => add one week
          dayOffset += WEEK_LENGTH;
      }
      return new Date(firstOfJanuaryDate.getTime()+dayOffset*24*60*60*1000);
  }
  
  var unixTime = function(date) {
    var type = typeof(date);
    if( type == 'undefined') {
      return parseInt(new Date().getTime() / 1000);
    } else if( type == 'string' ){
      var parts = date.match(/(^\d{2})w(\d{1,2})/); //13w28  (year w week)
      if( parts.length == 3 ) { 
        // { '12w28', '12', '38'}
        parts[1] = parseInt(parts[1]);
        parts[2] = parseInt(parts[2]);
        if( parts[1] < 90 ) { parts[1] += 2000; }
        else parts[1] += 1900;
        
        var stamp = firstDayOfWeek(parts[2], parts[1]);
        console.log('year: '+parts[1]+' week: '+parts[2]+' -> ' +stamp);
        return unixTime(stamp);
      }
      
    } else if( type == 'number' ){ 
      return unixTime(new Date(date));
    } else if( date.getTime ) return parseInt(date.getTime() / 1000);
    else return parseInt(new Date().getTime() / 1000);
  }
  var convertValues = function(timeInfo, values){
    var stamp = new Date( timeInfo[0]*1000 ).getTime();
    var interval = timeInfo[2]*1000;
    var data = {};
    for(var i=0;i<values.lenght;i++){
      if( values[i] != 'null'){
        data[stamp] = values[i];
      }
      stamp += interval;
      
    }
    return data;
  }
  var fetch = function(cfg, callback) {
    
    var from = unixTime(cfg.from);
    var to = unixTime(cfg.to);
    console.log("From: "+from+", to: "+to);
    try {
      hoard.fetch(getFile(cfg.id), from, to, 
        function(err, timeInfo, values) {
          if (err) {
            callback(err);
          } else {
            if( cfg.convert ) callback(null, convertValues( timeInfo, values));
            else {
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
        }
      );
    } catch(e){
      console.log('fetch-throw');
      callback(e);
    }
  }
  return {
    get: getHoard,
    info: getInfo,
    create: newHoard,
    remove: removeHoard,
    update: update,
    updateMany: updateMany,
    fetch: fetch,
  }
}
util.inherits(TimeSeries, events.EventEmitter);
module.exports = TimeSeries;


/* TEST */
var assert = require('chai').assert;
//var TimeSeries = require('TimeSeries');
var db;
describe('basic', function() {
  
  
  before( function(){
    db = new TimeSeries({dir: './hoards'});
    db.remove('123');
  });
  
  it('init', function(done) {
    db = new TimeSeries({dir: './hoards'});
    assert.typeOf( db, 'Object');
    assert.typeOf( db.info, 'Function');
    assert.typeOf( db.create, 'Function');
    assert.typeOf( db.remove, 'Function');
    assert.typeOf( db.update, 'Function');
    assert.typeOf( db.updateMany, 'Function');
    assert.typeOf( db.fetch, 'Function');
    
  });
  
  it('create', function(done) {
    
    db.create( {id: '123', archives: 
              [  
                [60,  60],     // 1min period 60min --> 60 points
              ], period: 0.5
    }, function(err, obj){
        console.log('READY..');
        assert.equal(err, null);
        assert.equal(obj.id, '123');
        assert.equal(obj.period, 0.5);
        assert.equal(obj.archives, [60*5,  12*24*7]);
        setTimeout( done, 1000);
      });
  });
});


/*
db.info('123', function(err, info){
  if(err)console.log(err);
  else console.log(info);
}); 

//db.remove('123');
db.create( {id: '123', archives: 
                  [  [60*5,  12*24*7],     // meas/5min  7 days --> 2016 points
                     [60*10, 6*24*30],    // meas/10min  30 days --> 4320 points
                     [60*60, 24*180],      // meas/1h    0.5 year --> 4320 points
                     [60*60*3, 24*180]      // meas/3h    3 year --> 4320 points 
                  ], period: 0.5 // xff The xfiles factor defines what part of a consolidation interval may be made up from *UNKNOWN* data while the consolidated value is still regarded as known. It is given as the ratio of allowed *UNKNOWN* PDPs to the number of PDPs in the interval. Thus, it ranges from 0 to 1 (exclusive).
           }, function(err, obj){
  if(err) {
    console.log('error');
    console.log(err);
  }
  else console.log(obj);
});


db.update({id: '123', data: [[parseInt(new Date().getTime() / 1000), 123]] }, function(err) {
    if(err) {
    console.log('error');
    console.log(err);
  }
    console.log('Hoard file updated!');
}); 
//console.log( db.get('123') ); 

db.fetch({id: '123', from: '13w35', to: '13w36', convert: false}, function(err, data){
  if(err) {
    console.log('error');
    console.log(err);
  }
  else console.log(data);
});
*/

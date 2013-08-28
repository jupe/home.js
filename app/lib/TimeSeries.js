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
    var i;
    for(i=0;i<cfg.data.length;i++){
      cfg.data[i][0] = unixTime(cfg.data[i][0]);
    }
    hoard.update(getFile(cfg.uuid), cfg.data, function(err) {
        callback(err);
    });
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
      day = (day === 0) ? 7 : day; // make the days monday-sunday equals to 1-7 instead of 0-6
      var dayOffset=-day+FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
      if (WEEK_LENGTH-day+1<4) {
          // the current week has not the minimum 4 days required by iso 8601 => add one week
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
        parts[1] = parseInt(parts[1]);
        parts[2] = parseInt(parts[2]);
        if( parts[1] < 90 ) { parts[1] += 2000; }
        else parts[1] += 1900;
        
        var stamp = firstDayOfWeek(parts[2], parts[1]);
        //console.log('year: '+parts[1]+' week: '+parts[2]+' -> ' +stamp);
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
    //console.log("From: "+from+", to: "+to);
    try {
      hoard.fetch(getFile(cfg.uuid), from, to, 
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
    create: newHoard,
    update: update,
    fetch: fetch,
  }
}

module.exports = TimeSeries;


/* TEST */
var db = new TimeSeries('./hoards');

db.create( {uuid: '123', archives: 
                  [  [60*5,  12*24],     // meas/5min  1 days
                     [60*10, 12*24*7],  // meas/10min  7 days
                     [60*60, 24*365*50] // meas/1h    50 year
                  ], period: 0.5 //0.5s interval
           }, function(err, obj){
  if(err)console.log(err);
  else console.log(obj);
});

db.update({uuid: '123', data: [[parseInt(new Date().getTime() / 1000), 123]]}, function(err) {
    if (err) throw err;
    console.log('Hoard file updated!');
}); 
console.log( db.get('123') ); 

db.fetch({uuid: '123', from: '13w35', to: '13w36', convert: true}, function(err, data){
  if(err) {
    console.log('error');
    console.log(err);
    
  }
  else console.log(data);
});


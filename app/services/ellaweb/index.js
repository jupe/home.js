var Ellaweb = require('./ellaweb');

var EllawebService = function(cfg) {
  var self = this;
  var timer = false;
  var ellaweb = new Ellaweb(cfg);
  var id = { temp: '', pwr: '', day: ''};
  
  var Init = function(){
    //Create devices if not exists
    db.device.findOrCreate(
      { name: 'ellaweb-temp'}, 
      { name: 'ellaweb-temp', 
        protocol : 'service', 
        type: 'meter'
      }, function(error, doc){
        if( error ){
          winston.error(error);
        } else if(doc){
          id.temp = doc.uuid;
        }
    });
    db.device.findOrCreate(
      { name: 'ellaweb-pwr-sum'}, 
      { name: 'ellaweb-pwr-sum', 
        protocol : 'service', 
        type: 'meter'
      }, function(error, doc){
        if( error ){
          winston.error(error);
        } else if(doc){
          id.pwr = doc.uuid;
        }
    });
    db.device.findOrCreate(
      { name: 'ellaweb-pwr-day'}, 
      { name: 'ellaweb-pwr-day', 
        protocol : 'service', 
        type: 'meter'
      }, function(error, doc){
        if( error ){
          winston.error(error);
        } else if(doc){
          id.day = doc.uuid;
        }
    });
  }
  
  var fetch = function(){
    winston.log('Read ellaweb data');
    ellaweb.Stat( function(error, data, stat){
      data.forEach( function(row){
        db.device.newMeasurementResult(id.pwr, row.date, row.sum,function(error, ok){
        });
        db.device.newMeasurementResult(id.day, row.date, row.day ,function(error, ok){
        });
        db.device.newMeasurementResult(id.temp, row.date, row.temp ,function(error, ok){
          if(error)winston.error(error);
        });
        timer = setTimeout( fetch, 60000*60*24 ); //every 24h
      });
      
      
    });
  }
  
  /* Interface functions */
  var start = function(){
    Init();
    if(!timer){
      timer = setTimeout( fetch, 1000 );
    }
    return status();
  }
  var stop = function(){
    if(timer){
      clearTimeout(timer);
      timer = false;
    }
    return status();
  }
  var status = function(){
    return {  
      enable: timer?true:false
    };
  }
  var configurations = function(cfg){
    if( cfg ) {
      console.log('ellaweb configs: '+cfg);
      ellaweb.configurations(cfg);
    } 
    return {
      place: 0,
      nCustomerID: 0
    }
  }

  /* MODULE API */
  return {
    start: start,
    stop: stop,
    status: status,
    configurations: configurations
  }
  
}
var OptionTemplate = {
  "place": 0,
  "nCustomerID": 0
}
var OptionSchema = {
  type: 'object',
  properties: {
    place: 'number',
    nCustomerID: 'number'
  } 
}
// export the class
module.exports = EllawebService;
module.exports.OptionTemplate = OptionTemplate;
module.exports.OptionSchema = OptionSchema;
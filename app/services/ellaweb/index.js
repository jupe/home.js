var Ellaweb = require('./ellaweb'),
   request = require('request');

var EllawebService = function(cfg, app, apiurl) {
  var self = this;
  var timer = false;
  var timestamp = new Date();
  if( cfg && cfg.timestamp){
    timestamp = cfg.timestamp;
  }
  var ellaweb = new Ellaweb(cfg);
  
  var id = { device: '', temp: '', pwr: ''};
  
  var Init = function(){
    //Create devices if not exists
    db.device.findOrCreate(
      { name: 'ellaweb'}, 
      { name: 'ellaweb', 
        type: 'meter',
        sensors: [
          { name: 'temperature', unit: 'C' },
          { name: 'power', unit: 'kW' }
        ]
      }, function(error, doc){
        if( error ){
          winston.error(error);
        } else if(doc){
          id.device = doc.uuid;
          id.temp = doc.sensors[0].uuid;
          id.pwr = doc.sensors[1].uuid;
        }
    });
  }
  
  var fetch = function(){
    winston.info('Read ellaweb data');
    ellaweb.Stat(  timestamp, function(error, data, stat){
      if( error ) {
        winston.error(error);
      } else {
        winston.log('Ellaweb data parsed successfully. len: '+data.length);
        db.device.findOne({uuid: id.device}, function(error, doc){
          if( error ) {
            winston.error(error);
          } else if( doc ) {
            data.forEach( function(row){
              //push temperature
              request({
                url: apiurl+'/timeserie/'+id.temp,
                json: { 'date': row.hour, value: row.temp },
                method: 'PUT'
              }, function(err, res, body){
              });
              //push power
              request({
                url: apiurl+'/timeserie/'+id.pwr,
                json: { 'date': row.hour, value: row.sum },
                method: 'PUT'
              }, function(){});
            });
            //increment one day
            winston.info('Ellaweb - next day..');
            
            timestamp = new Date(timestamp.getTime() + (24 * 60 * 60 * 1000));
            db.service.update({name: 'ellaweb'}, {'configurations.timestamp': timestamp}, function(){});
            if( timestamp.getTime() >= (new Date().getTime()) ){
              timer = setTimeout( fetch, 60000*60*24 ); //every 24h
            } else {
              fetch();
            }
            
          } else {
            winston.error('ellaweb device not found ?!');
          }
        });
      }  
    });
  }
  
  /* Interface functions */
  var start = function(){
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
  var schema = function(){
    return OptionSchema;
  }
  Init();
  /* MODULE API */
  return {
    start: start,
    stop: stop,
    status: status,
    configurations: configurations,
    schema: schema
  }
  
}
var OptionTemplate = {
  "place": 0,
  "nCustomerID": 0,
  "timestamp": new Date(2013,6,1)
}
var OptionSchema = {
  type: 'object',
  properties: {
    place: {type: 'string', required: true},
    nCustomerID: {type: 'string', required: true},
    timestamp: 'date'
  } 
}
// export the class
module.exports = EllawebService;
module.exports.OptionTemplate = OptionTemplate;
module.exports.OptionSchema = OptionSchema;
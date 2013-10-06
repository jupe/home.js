var http = require('http')
  , request = require('request')
  , Ow = require("./onewire");

/*
global.CFG = {app: {
  host: 'home',
  port: 100
}}
global.db = {
  action: {
    findOrCreate: function(){}
  }
}
*/


var OwApi = function(config){
  var self = this;
  var ow = new Ow(config);
  
  var apiurl = 'http://localhost:3000/api/v0';

  var findOwid = function(id, cb)
  {
    db.device.findOne( {'sensors.name': id, 'sensors.protocol': 'ow'}, function(error, data){
      if(error){
        cb(error);
      } else if( data ){
        cb(null, data);
      } else{
        cb(null, null, id);
      }
    });
  }
  var isNumber = function(o) {
    return ! isNaN (o-0) && o != null;
  }
  var Init = function() {
    //create ping action if it not exists
    console.log('create ping action if it not exists yet');
    db.action.findOrCreate({name: 'owPing'}, { name: 'owPing', type: 'script', script: 'ow.ping();' }, 
      function(err, action, _new){
        if( err ){
          
          console.log(err);
        } else {
          if(_new)console.log('Created owPing action');
          db.schedule.findOrCreate({name: 'owPing'}, { name: 'owPing', cron: '0 * * * * *', actions: [ action.uuid]}, function(err,doc, _new){
              if( err ){
                console.log(err);
              } else if(_new){
                console.log('Created owPing schedule');
              }
          });
            
        }
    });
    
    //create measure action if it not exists
    console.log('create measure action if it not exists yet');
    db.action.findOrCreate({name: 'owReadAll'}, { name: 'owReadAll', type: 'script', script: 'ow.readAll();' }, function(err, action, _new){
      if( err ){
          console.log(err);
      } else {
        if(_new)console.log('Created owReadAll action');
        db.schedule.findOrCreate({name: 'owReadAll'}, { name: 'owReadAll', cron: '0 */5 * * * *', actions: [ action.uuid]}, 
        function(err, found, _new){          
          if( err ){
            console.log(err);
          } else if(_new){
            console.log('Created owReadAll schedule');
          }
        });
      }
    });
  }
  this.Ping = function(){
    console.log("ping ow devices");
    try {
      ow.dir("/",function(directories){
        directories.forEach( function(directory){
          if( directory.match(/\d{2}.[A-F,0-9]{12}/)  )
          {
            id = directory.replace("/","");
            //console.log("Founded device %s, check if its already in db", id);
            findOwid(id, function(error, device, id){
              if( error ){
              } else if( device ){
                //console.log("id "+id+" is already in db");
              } else {
                console.log("New OW sensor detected with id "+id);
                var newDevice = {
                  type: 'sensor',
                  name: id,
                  sensors: [ {
                    name: id,
                    protocol: 'ow',
                    id: id,
                    unit: 'C'
                  }]
                };
                request( { url: apiurl+'/device', json: newDevice, method: "POST" },
                  function(error, res, body){
                  if(error)console.log(error);
                  //console.log(data);
                  db.event.store( {
                      msg: error?'OW device creation failed':'new ow-device detected with id: '+data.id,
                      details: error?error:null, 
                      type: error?'fatal':'general',
                      source: {
                          component: 'onewire-service',
                      }
                    }, function(){});
                });
              }
            });
          } 
        });
        //queue for next ping in the next predefined interval
      });
    } catch(e) {
      console.log("OwException");
      console.log(e); 
    }
  }
  this.Read = function(device, callback)
  {
    var path = "/"+device.sensors[0].name+"/temperature";
    console.log("Reading path: "+path);
    try {
       ow.read(path, function(result){
        if( result !== false && isNumber(result) ){
          //console.log("result: %d", result);
          var data = {date: (new Date()).getTime(), value: result};
          request( { 
            url: apiurl+'/timeserie/'+device.sensors[0].uuid, 
            json: data, method: "PUT" },
            function(error, res, body){
             callback(res.statusCode==200?null:error, device); 
          });
        }
        else{ 
          console.log("Invalid value: "+result);
          callback('fail', device);
        }
      });
    } catch(e) {
      console.log("OwException");
      console.log(e);
      callback(e, device);
    }
  }
  this.ReadAll = function(){
    console.log("readAll");
    db.device.find({'sensors.protocol': 'ow', enable: true}, function(error, devices){
      if( error ) {
          console.log("getDevicesByProtocol::error");
          console.log(error);
      } else {
        for(var i=0;i<devices.length;i++){
          self.Read( devices[i], function(error, device){
            if( error ){
              db.device.update( {uuid: device.uuid}, {enable: false}, function(){});
              db.event.store( {
                  msg: 'OW read fail ('+device.id+'). Sensor Disabled. Check connection! ',
                  details: error, 
                  type: 'fatal',
                  source: {
                      component: 'onewire-service',
                      uuid: device.uuid,
                  }
              }, function(){});
            }
          });
        //var cmd = "-t C N:"+ result;
        //console.log(cmd);
        //rrd.rrdExec( "update",  cmd, function(err){
        //    if(err){
        //        console.log(err);
        //    }
        //    else console.log("update success");
        //});
        }
      }
    });
  }
  
  Init();
  
  return this;
}

// export the class
module.exports = OwApi;

//var o = new OwApi('123', '');
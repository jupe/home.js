var http = require('http');
var httpjs = require('http-json-request');

httpjs.defaultHost( CFG.app.host );
httpjs.defaultPort( CFG.app.port );


var Ow = require("./api_onewire");
var ow = new Ow(CFG.owfs.host, CFG.owfs.port);


function findOwid(id, cb)
{
    db.device.findOne( {id: id, protocol: 'ow'}, function(error, data){
        if(error){
            cb(error);
        } else if( data )
        {
            cb(null, data);
        } else{
            cb(null, null, id);
        }
    });
}
function isNumber (o) {
  return ! isNaN (o-0) && o != null;
}
var instance;
function OwService() {
    instance=this;
    
    //create ping action if it not exists
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
OwService.prototype.ping = function(archives, period){
    console.log("reload ow meters");
    
    if( !(archives instanceof Array))
        archives = [ [60*5, 12*24],     // meas/5min  1 days
                     [60*10, 12*24*7],  // meas/10min  7 days
                     [60*60, 24*365*50] // meas/1h    50 year
                  ];
    if( !period )
        period = 0.5;
    try {
     ow.dir("/",function(directories){
        console.log(directories);
        for(var i=0;i<directories.length;i++){
            var id = directories[i];
            if( id[0] == '/' && id[3] == '.' && id.length>14  )
            {
                id = id.replace("/","");	
                //console.log("Founded device %s, check if its already in db", id);
                findOwid(id, function(error, device, id){
                    if( error ){
                    } else if( device ){
                         //console.log("id "+device.id+" is already in db");
                    } else {
                        console.log("New OW sensor detected with id "+id);
                        var device = {
                            protocol: 'ow',
                            type: 'meter',
                            id: id,
                            hoard: {
                                enable: true,
                                archives: archives,
                                period: period
                            }
                        };
                        httpjs.postJSON( '/devices.json', device, function(error, data){
                            console.log(error);
                            //console.log(data);
                            db.event.create( {
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
        }
        //queue for next ping in the next predefined interval
     });
    } catch(e) {
        console.log("OwException");
        console.log(e); 
    }
}
OwService.prototype.read = function(device, callback)
{
    var path = "/"+device.id+"/temperature";
    console.log("Reading device: "+path);
    try {
       ow.read(path, function(result){
            if( result !== false && isNumber(result) ){
                console.log("result: %d", result);
                values = []; //[[result]]
                var unixStamp = parseInt(new Date().getTime() / 1000);
                for(var i=0;i<device.hoard.archives.length;i++)
                    values.push( [unixStamp, result] ); //because all hoard-archives need to be update
                httpjs.postJSON( '/devices/'+device.uuid+"/events.json", 
                              { values: values, type: 'hoard' }, callback);
            }
            else{ 
                console.log("Invalid value");
                callback('fail', device);
            }
        });
        
    } catch(e) {
        console.log("OwException");
        console.log(e);
        callback(e, device);
    }
}
OwService.prototype.readAll = function(){
    console.log("readAll");
    //console.log(instance);
    db.devices.find({protocol: 'ow', enable: true}, function(error, devs){
        if(error){
            console.log("getDevicesByProtocol::error");
            console.log(error);
        }
        else {
            for(var i=0;i<devs.length;i++){
               instance.read( devs[i], function(error, device){
                    if( error ){
                        db.device.update( {uuid: device.uuid}, {enable: false}, function(){});
                        db.event.create( {
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
// export the class
module.exports = OwService;
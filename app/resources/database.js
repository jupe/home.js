var fs = require('fs');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Mongo = require('./mongodb/api');

var schDevice = require('./mongodb/schema/device');
var schDeviceEvent = require('./mongodb/schema/device.event.js');

/*
var Configure = new Schema({ 
    name: {type: String, unique: true, index: true},
    host: {type: String},
    enable: {type: Boolean},
    simulate: {type: Boolean},
    ssh: {type: Boolean},
    username: {type: String},
    password: {type: String},
    port: {type: Number, default: 4304},
});*/

// Constructor
function Db() {
   var self = this;
   
  fs.readdirSync(__dirname + '/mongodb/model').forEach(function(file){
    var sch = require('./mongodb/schema/'+file);
    if( sch.disable ){}
    else {
      var name = file.substr(0,file.length-3);
      winston.info('Register model '+name .cyan);
      self[name] = require('./mongodb/model/'+file);
    }
  });
   
   
   /*
   this.configureModel.create( {name: 'email', 
                                  from: "no-reply@gmail.com",
                                  host: "smtp.kolumbus.fi",
                                  ssh: false, 
                                  username: '',
                                  password: ''
                                  }, function(e,d){});
    this.configureModel.create( { name: 'owfs', 
                                  host: "localhost",
                                  port: 4304,
                                  simulate: true
                                  }, function(e,d){}); */                           
   
   //this.actionModel.create( {uuid: '0', name: 'test', script: 'console.log("test")'}, function(e,d){}); 
   //this.scheduleModel.create( { uuid: '0', enable: true, name: 'scheduler updater', actions: ['0'], cron: '*/10 * * * *' }, function(e,d){});
   /*
   var data = {
      uuid: '0',
      enable: true,
      name: 'scheduler updater',
      cron: '0 * * * *'
   }
   this.schedulersModel.create(data
   //this.eventModel.create(data
   , function(error,data){});
   */
}

// export the class
module.exports = Db;

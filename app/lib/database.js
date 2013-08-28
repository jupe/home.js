var fs = require('fs');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Mongo = require('./mongodb/api');


// Constructor
function Db() {
   var self = this;
   
  fs.readdirSync(__dirname + '/mongodb/model').forEach(function(file){
    var sch = require('./mongodb/schema/'+file);
    if( sch.disable ){}
    else {
      var name = file.substr(0,file.length-3);
      winston.info('Register model '+name .cyan);
      self[name] = new Mongo( name, sch);
      //require('./mongodb/model/'+file);
    }
  });
  
  /* Create if not exists already*/
  var nullFunc = function(err, doc){}
  self.user.findOrCreate( {name: 'admin'}, {name: 'admin', password: 'admin'}, nullFunc);
  self.group.findOrCreate( {name: 'admin'}, {name: 'admin', users: ['admin']}, nullFunc);
  self.group.findOrCreate( {name: 'admin'}, {name: 'default', users: ['admin']}, nullFunc);
  self.event.findOrCreate( {name: 'admin'}, {type: 'info', source: {type: 'service', name: 'home.js'}, msg: 'startup'}, nullFunc);
  
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

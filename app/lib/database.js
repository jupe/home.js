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
  self.user.store( {name: 'admin'}, function(error, doc){});
  self.group.store( {name: 'admin', users: ['admin']}, function(error, doc){});
  self.group.store( {name: 'default', users: ['admin']}, function(error, doc){});
   
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

var fs = require('fs');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var MongoApi = require('./api');


// Constructor
function Database() {
  var self = this;
  
  var Load = function(){
    winston.info('Register db models');
    fs.readdirSync(__dirname + '/schema').forEach(function(file){
      var sch = require('./schema/'+file);
      if( sch.disable ){}
      else {
        var name = file.substr(0,file.length-3);
        winston.log('Register model '+name .cyan);
        self[name] = new MongoApi( name, sch);
      }
    });
    
    /* Create if not exists already*/
    var nullFunc = function(err, doc){}
    self.user.findOrCreate( {name: 'admin'}, {name: 'admin', password: 'admin'}, nullFunc);
    self.group.findOrCreate( {name: 'admin'}, {name: 'admin', users: ['admin']}, nullFunc);
    self.group.findOrCreate( {name: 'admin'}, {name: 'default', users: ['admin']}, nullFunc);
    self.event.findOrCreate( {name: 'admin'}, {type: 'info', source: {type: 'service', name: 'home.js'}, msg: 'startup'}, nullFunc);
  }
  
  Load();
}

// export the class
module.exports = Database;

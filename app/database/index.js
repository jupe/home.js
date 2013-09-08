var fs = require('fs');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Mongo = require('./api');


// Constructor
function Database() {
  var self = this;
  
  var Load = function(){
    fs.readdirSync(__dirname + '/model').forEach(function(file){
      var sch = require('./schema/'+file);
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
  }
  
  Load();
}

// export the class
module.exports = Database;

var fs = require('fs');

var Services = function(app){
  var Load = function(){
    global.service = {};
    
    var loadService = function(service, filename){
      var GetCfg = function(){
        try{
          return CFG.app.service[service];
        } catch(e){
          winston.error('service '+service+' not contains any configurations?!');
          return false;
        }
      }
      winston.info('Loading service '+service .cyan);
      try{
        var serv = require(filename);
        if( serv.disable ){
          winston.info('Init service '+service .cyan + 'disabled');
        } else {
          winston.info('Init service '+service .cyan);
          
          global.service[service] = new serv(GetCfg(), app);
          
          db.service.findOrCreate( {name: service}, {name: service, enable: false}, function(error, doc){
            if(error){ winston.error(error); }
            else if( doc.enable ){
              winston.info('Activating service '+doc.name.cyan);
              global.service[doc.name].start();
            }
          });
        }
      } catch(e){
        winston.error('Cannot load service '+service .red);
      }
     }
     
     var folders = fs.readdirSync(__dirname );
     folders.forEach(function(service){
        var filename = __dirname+'/'+service+'/index.js';
        if( fs.existsSync(filename) ) {
          loadService(service, filename);          
        }
      });
  }
  Load();
  process.on('SIGINT', function() {
    for(var key in service){
      if( service[key].stop ) {
        service[key].stop();
      }
    }
  });
}


module.exports = Services;
/* TEST
require('colors');
global.winston = {
  info: function(x){console.log(x);},
  log: function(x){console.log(x);},
  error: function(x){console.log(x);}
}
global.CFG = {
  app: {
    host: ''
  },
  owfs: {
    host: 'locahost'
  },
  email: {
    from: '',
    to: '',
  },
  app: {
    service: {
      cron: {
        poll_interval: 1000,
      }
    }
  }
};
var app;
var test = Services(app);
*/
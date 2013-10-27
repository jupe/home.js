var fs = require('fs');

var Services = function(app){
  var apiurl = 'http://localhost:3000/api/v0';
  var Load = function(){
    global.service = {};
    
    var loadService = function(service, filename){
      try{
        var serv = require(filename);
        if( serv.disable ){
          winston.info('Init service '+service .cyan + ' - disabled');
        } else {
          winston.info('Init service '+service .cyan);
          
          //create new service instance with configs(if something is in config.json file)
          db.service.findOrCreate( 
            {name: service}, 
            { name: service, 
              enable: false
            }, function(error, doc, isNew){
            if(isNew){
              console.log('isNew');
              if( serv.OptionTemplate ){ 
                //if there is something for options, store it to db
                doc.configurations = serv.OptionTemplate;
              }
            }
            global.service[service] = new serv(doc.configurations, app, apiurl);
            if(error){ winston.error(error); }
            else if( doc.enable ){
              winston.info('Activating service '+doc.name.cyan);
              global.service[doc.name].start();
            }
            doc.save();
          });
        }
      } catch(e){
        console.log(e);
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
    //Exist all services if they exists.
    for(var key in service){
      if( service[key].stop ) {
        service[key].stop();
      }
    }
  });
}


module.exports = exports = Services;
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
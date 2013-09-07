var fs = require('fs');
var Services = function(){
  var Load = function(){
    global.service = {};
     var loadService = function(filename){
      winston.info('Loading service '+filename .cyan);
      try{
        /** @bug somewhy this causes error: "error: uncaughtException" */
        var serv = require(filename);
        var name = file.substr(0, file.length-3);
        if( serv.disable ){
          winston.info('Init service '+name .cyan + 'disabled');
        } else {
          winston.info('Init service '+name .cyan);
          global.service[name] = new serv(app);
        }
      } catch(e){
        winston.error(e);
      }
     }
     
     var folders = fs.readdirSync(__dirname );
     folders.forEach(function(file){
        var filename = __dirname+'/'+file+'/index.js';
        if( fs.existsSync(filename) ) {
          loadService(filename);          
        }
      });
  }
  
  Load();
}

module.exports = Services;
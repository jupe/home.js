var fs = require('fs');

var Addons = function(app){
  var Load = function(){
    global.addons = {};
    var loadAddon = function(addon, filename){
      //try{
        var Addon = require(filename);
        if( Addon.disable ){
          winston.info('Init addon '+addon .cyan + ' - disabled');
        } else {
          winston.info('Init addon '+addon .cyan);
        }
        
        global.addons[addon] = new Addon(app);
        
      /*} catch(e){
        console.log(e);
        winston.error('Cannot load addon '+addon .red);
      }*/
    }
    
    var folders = fs.readdirSync(__dirname );
    folders.forEach(function(addon){
      var filename = __dirname+'/'+addon+'/index.js';
      if( fs.existsSync(filename) ) {
        loadAddon(addon, filename);          
      }
    });
  }
  Load();
  process.on('SIGINT', function() {
    //Exist all services if they exists.
    for(var key in addons){
      if( addons[key].stop ) {
        addons[key].stop();
      }
    }
  });
}

module.exports = exports = Addons;
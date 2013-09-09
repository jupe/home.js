var fs = require('fs');
var RouteLoader = function(app){
  winston.info('Init routes');
  fs.readdirSync(__dirname).forEach(function(file){
    if( file!='index.js' && file.indexOf('.js') >= 0 ) {
      var route = require('./'+file);
      if( route.disable ){}
      else {
        var name = file.substr(0, file.length-3);
        //winston.info('Init routes '+name .cyan);
        route(app, '/api/v0');
      }
    }
  });
}
module.exports = RouteLoader;
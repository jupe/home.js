// Constructor
var Ow = function(config) {
  var connection;
  var Client=false;
  var LoadSimulator = function(){
      function simulator(){}
      simulator.prototype = Object.create(simulator.prototype);
      simulator.prototype.dir = function(url, cb){
          cb(['/28.9AE37A030000', '/28.9AE37A030002']);
      }
      function random(min, max) {
        return(Math.floor(Math.random() * (max-min)*10)+min*10)/10;
      };
      simulator.prototype.read = function(url, cb){
          if( url == '/28.9AE37A030000/temperature' )
              cb(random(-20, 5) );
          else if( url == '/28.9AE37A030002/temperature' )
              cb(random(15, 25) );
          else cb(false);
      }
      Client = simulator;
      winston.info('using ow-simulator'.yellow);
  }
  try {
    if( config.simulate ) {
      throw("use simulator instead");
    } 
    Client = require("owfs").Client;
  } catch(e){
    //owfs loading fails -> simalator
    Client = false;
  }
  if(!Client) LoadSimulator();
  
  
  // always initialize all instance properties
  connection = new Client(config.host, config.port); 
  
  // class methods
  this.dir = function(url, cb) {
    connection.dir(url,cb);
  }
  this.read = function(url, cb){
    connection.read(url, cb);
  }
  return this;
}
// export the class
module.exports = Ow;
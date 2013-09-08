// Constructor
var Ow = function(host, port) {
  var connection;
  var Client;
  
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
          else cb('false');
      }
      Client = simulator;
      winston.info('using ow-simulator'.blue);
  }
  
  try {
    Client = require("owfs").Client;
  } catch(e){
    //owfs loading fails -> simalator
    Client = false;
  }
  if(!Client) LoadSimulator();
  
  // always initialize all instance properties
  connection = new Client(host, port); 
  
  // class methods
  var dir = function(url, cb) {
    connection.dir(url,cb);
  }
  var read = function(url, cb){
    connection.read(url, cb);
  }
}
// export the class
module.exports = Ow;
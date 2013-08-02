var Client;
if( require('../config/config').owfs.simulate )
{
    function simulator(){
    }
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
} else{
    Client = require("owfs").Client;
}

// Constructor
function Ow(host, port) {
  // always initialize all instance properties
  this.host = host
  this.port = port; // default value
  this.con = new Client(this.host,this.port); 
}
// class methods
Ow.prototype.dir = function(url, cb) {
    this.con.dir(url,cb);
};
Ow.prototype.read = function(url, cb)
{
    this.con.read(url, cb);
}
// export the class
module.exports = Ow;
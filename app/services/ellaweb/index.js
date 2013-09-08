var Ellaweb = require('./ellaweb');

var EllawebService = function(cfg) {
  var self = this;
  var timer = false;
  console.log(cfg);
  var ellaweb = new Ellaweb(cfg);
  
  
  var fetch = function(){
    winston.log('Read ellaweb data');
    ellaweb.Stat( function(error, data, stat){
      console.log(data);
      timer = setTimeout( fetch, 60000*60*24 ); //every 24h
    });
  }
  
  /* Interface functions */
  var start = function(){
    if(!timer){
      timer = setTimeout( fetch, 1000 );
    }
    return status();
  }
  var stop = function(){
    if(timer){
      timer.stop();
    }
    return status();
  }
  var status = function(){
    return {  
      enable: timer?true:false
    };
  }

  /* MODULE API */
  return {
    start: start,
    stop: stop,
    status: status
  }
  
}
// export the class
module.exports = EllawebService;
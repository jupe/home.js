var request = require('request');

var OpenWeatherMap = function(cfg){
  
  var apiUrl = 'http://api.openweathermap.org/data/2.5';
  var position = '';
  function Init(){
    if(cfg.position) 
      position = cfg.position;
  }
  function parse(data){
    if( data.count == 1 ){
      return data.list[0];
    } else {
      return {}
    }
    
  }
  this.position = function(newPos){
    if( newPos){
      position = cfg.position;
    }
    return position;
  }
  this.getCity = function( callback ){
     request.get( {
      json: true, 
      url: apiUrl+'/forecast/daily?mode=json&q='+position
      }, function(error, response, body){
        if(error){
          callback( error );
        } else if(response.statusCode == 200 ){
          callback(null, body.city);
        } else {
          callback({error: 'invalid statusCode', statusCode: response.statusCode});
        }
    });
  }
  this.getCurrentWeather = function(callback){
    request.get( {
      json: true, 
      url: apiUrl+'/find?mode=json&units=metric&q='+position
      }, function(error, response, body){
        if(error){
          callback( error );
        } else if(response.statusCode == 200 ){
          callback(null, parse(body));
        } else {
          callback({error: 'invalid statusCode', statusCode: response.statusCode});
        }
    });
  }
  Init();
  return this;
}
module.exports = OpenWeatherMap;

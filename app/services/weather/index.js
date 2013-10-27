  
var 
  // npm modules
    request = require('request')
  // own modules
  , OpenWeatherMap = require('./openweathermap');

// @todo  position from configs
var WeatherService = function(cfg, app, apiurl) {
  var api = new OpenWeatherMap({position: 'Oulu'});
  var timer = false;
  var id = {
  }
  
  function Init(){
    db.device.findOrCreate(
      { name: 'weather'}, 
      { name: 'weather', 
        type: 'meter',
        sensors: [
          { name: 'temperature', unit: 'C' },
          { name: 'humidity', unit: '%' },
          { name: 'pressure', unit: 'kPa' },
          { name: 'windSpeed', unit: 'km/h' },
          { name: 'windDeg', unit: 'def' },
          { name: 'clouds', unit: '%' },
          { name: 'snow', unit: 'cm' },
        ]
      }, function(error, doc, newDoc){
        if( error ){
          winston.error(error);
        } else if(doc){
          api.getCity( function(error, city){
            if( error ){
              winston.error(error);
            } else {
              doc.set( 'location.geo', [city.coord.lon, city.coord.lat]);
              doc.set( 'location.city', city.name);
              doc.set( 'location.country', city.country);
              doc.save( function(error, ok){
                if(error)winston.error(error);
              });
              if( doc.location.city ){
                api.position( doc.location.city );
              }
            }
          });
          
          id.device = doc.uuid;
          id.temp = doc.sensors[0].uuid;
          id.humidity = doc.sensors[1].uuid;
          id.press = doc.sensors[2].uuid;
          id.windSpeed = doc.sensors[3].uuid;
          id.windDeg = doc.sensors[4].uuid;
          id.clouds = doc.sensors[5].uuid;
          id.snow = doc.sensors[6].uuid;
        }
    });
  }
  function now(req, res){
    api.getCurrentWeather( function(error, now){
      res.json(now);
    });
  }
  function putValue(id, date, value){
    request({
        url: apiurl+'/timeserie/'+id,
        json: { 'date': date, value: value },
        method: 'PUT'
      }, function(error, response, body){
        if( response.statusCode != 200 ){
          winston.error(body);
        }
      });
  }
  function update(){
    api.getCurrentWeather( function(error, now){
      winston.log(now);
      putValue( id.temp, now.dt*1000, now.main.temp);
      putValue( id.humidity, now.dt*1000, now.main.humidity);
      putValue( id.press, now.dt*1000, now.main.pressure);
      putValue( id.windSpeed, now.dt*1000, now.wind.speed);
      putValue( id.windDeg, now.dt*1000, now.wind.deg);
      putValue( id.clouds, now.dt*1000, now.clouds.all);
      putValue( id.snow, now.dt*1000, now.snow['3h']);
      
    });
  }
  this.start = function(){
    if(!timer){
      timer = setTimeout( update, 1000*60*60 );
      setTimeout( update, 2000);
    }
    return this.status();
  }
  this.stop = function(){
    if(timer){
      clearTimeout(timer);
      timer = false;
    }
    return this.status();
  }
  this.status = function(){
    return {  
      enable: timer?true:false
    };
  }
  this.configurations = function(cfg){
    return api.position(cfg.position);
  }
  this.schema = function(){
    return {
      type: 'object',
      properties: {
        city: {type: 'string', required: true},
      } 
    }
  }
  Init();
  return this;
}
module.exports = WeatherService;
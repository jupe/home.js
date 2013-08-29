module.exports = function(app, apiurl){
  //app.get('/devices/status', require('./resources/device').status);
  var devices = require('./../resources/devices');
  var events = require('./../resources/device.events');
  var data = require('./../resources/device.data');
  
  app.get(apiurl+'/device/events.:format?', devices.events);
  //app.get(apiurl+'/device/:device/events.:format?', devices.events);
  //app.get(apiurl+'/device/:device/events/:event.:format?', devices.event);
  //app.post(apiurl+'/device/:device/events.:format?', devices.newEvent);
  var devicesResource = app.resource(apiurl.substr(1)+'/device', devices);
  var eventResource = app.resource('event', events);
  devicesResource.map(eventResource);
  
  
  var dataResource = app.resource('data', data);
  devicesResource.map(dataResource);
  
  
}
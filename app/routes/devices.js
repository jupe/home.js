module.exports = function(app, apiurl){
  //app.get('/devices/status', require('./resources/device').status);
  var devices = require('./../resources/devices');
  var events = require('./../resources/device.events');
  var timeseries = require('./../resources/timeseries');
  var rules = require('./../resources/rules');
  
  app.get(apiurl+'/device/events.:format?', devices.events);
  //app.get(apiurl+'/device/:device/events.:format?', devices.events);
  //app.get(apiurl+'/device/:device/events/:event.:format?', devices.event);
  //app.post(apiurl+'/device/:device/events.:format?', devices.newEvent);
  var devicesResource = app.resource(apiurl.substr(1)+'/device', devices);
  var eventResource = app.resource('event', events);
  devicesResource.map(eventResource);
  
  //app.post(apiurl+'/device/:device/sensor/:sensor', devices.newSensorData);
  
  
  
  app.get(apiurl+'/device/:device/sensor/:sensor/:resolution.:format?', timeseries.array);
  var timeseriesResource = app.resource('sensor', timeseries);
  devicesResource.map(timeseriesResource);
  
  
  var ruleResource = app.resource('rule', rules);
  devicesResource.map(ruleResource);
  
  
}
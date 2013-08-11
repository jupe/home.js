module.exports = function(app){
  //app.get('/devices/status', require('./resources/devices').status);
  var devices = require('./../resources/devices');
  app.get('/devices/status.:format?', devices.status);
  app.get('/devices/tree.:format?', devices.tree);
  app.get('/devices/events.:format?', devices.events);
  app.get('/devices/:device/events.:format?', devices.events);
  app.post('/devices/:device/events.:format?', devices.newEvent);
  var devicesResource = app.resource('devices', devices);
  
}
module.exports = function(app){
  //app.get('/devices/status', require('./resources/device').status);
  var devices = require('./../resources/devices');
  app.get('/device/status.:format?', devices.status);
  app.get('/device/tree.:format?', devices.tree);
  app.get('/device/events.:format?', devices.events);
  app.get('/device/:device/events.:format?', devices.events);
  app.post('/device/:device/events.:format?', devices.newEvent);
  var devicesResource = app.resource('device', devices);
  
}
module.exports = function(app){
  
  //app.resource('meter', require('./resources/meters'));
  app.resource('chart', require('./../resources/charts'));
  app.resource('event', require('./../resources/events'));
  app.resource('map', require('./../resources/maps'));
  app.resource('network', require('./../resources/networks'));
  app.resource('schedule', require('./../resources/schedules'));
  app.resource('action', require('./../resources/actions'));
  app.resource('automation', require('./../resources/automations'));
  app.resource('expert', require('./../resources/experts'));
  
}
module.exports.disable = false;
module.exports = function(app){
  
  //app.resource('meters', require('./resources/meters'));
  app.resource('charts', require('./../resources/charts'));
  app.resource('events', require('./../resources/events'));
  app.resource('maps', require('./../resources/maps'));
  app.resource('networks', require('./../resources/networks'));
  app.resource('schedules', require('./../resources/schedules'));
  app.resource('actions', require('./../resources/actions'));
  app.resource('automations', require('./../resources/automations'));
  app.resource('experts', require('./../resources/experts'));
  
}
module.exports.disable = true;
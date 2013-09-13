module.exports = function(app,apiurl){
  
  app.resource(apiurl.substr(1)+'/schedule', require('./../resources/schedules'));
  app.resource(apiurl.substr(1)+'/action', require('./../resources/actions'));
  app.resource(apiurl.substr(1)+'/rule', require('./../resources/rules'));
  
  app.resource(apiurl.substr(1)+'/event', require('./../resources/events'));
  
  app.resource(apiurl.substr(1)+'/data', require('./../resources/datas'));
  
  /*
  //app.resource('meter', require('./resources/meters'));
  app.resource(apiurl.substr(1)+'/chart', require('./../resources/charts'));
  
  app.resource(apiurl.substr(1)+'/map', require('./../resources/maps'));
  app.resource(apiurl.substr(1)+'/network', require('./../resources/networks'));
  app.resource(apiurl.substr(1)+'/automation', require('./../resources/automations'));
  app.resource(apiurl.substr(1)+'/expert', require('./../resources/experts'));
  */
  
}
module.exports.disable = false;
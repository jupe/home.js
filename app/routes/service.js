module.exports = function(app, apiurl){
  var service = require('./../controllers/service');
  var auth = require('./../middleware/authentication').Middleware;

  app.get(apiurl+'/service:format?', service.index);
  app.post(apiurl+'/service/:service/:operation', auth.isAdmin, service.operation);
  app.get(apiurl+'/service/:service', service.status);
  app.post(apiurl+'/service/:service', auth.isAdmin, service.update);
}
module.exports.disable = false;

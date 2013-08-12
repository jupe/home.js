module.exports = function(app){
  var service = require('./../controllers/service');
  var auth = require('./../middleware/authentication').Middleware;

  app.get('/service:format?', service.index);
  app.post('/service/:service/:operation', auth.isAdmin, service.operation);
  app.get('/service/:service', service.status);
}
module.exports.disable = false;

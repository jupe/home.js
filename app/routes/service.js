module.exports = function(app){
  var admin = require('./../controllers/service');
  var auth = require('./../middleware/authentication').Middleware;

  app.post('/service/:service/:operation', auth.isAdmin, admin.service);
  app.get('/service/:service', admin.serviceStatus);
}
module.exports.disable = false;

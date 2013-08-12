module.exports = function(app){
  var admin = require('./../controllers/service');

  app.post('/service/:service/:operation', admin.service);
  app.get('/service/:service/:operation', admin.service);
  app.get('/service/:service', admin.serviceStatus);
}
module.exports.disable = false;

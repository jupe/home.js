module.exports = function(app){
  var defaults = require('./../controllers');
  app.get('/', defaults.index);
  app.post('/login', defaults.login);
  app.get('/logout', defaults.logout);
  
  app.get('/routes', function(req,res){ res.json(app.routes)}); //print all possible routes
}
module.exports.disable = false;
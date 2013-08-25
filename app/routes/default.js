module.exports = function(app,apiurl){
  var defaults = require('./../controllers/defaults');
  app.get('/', defaults.index);
  //app.post('/login', defaults.login);
  app.get('/logout', defaults.logout);
  app.get(apiurl+'/logout', defaults.logout);
  
  app.get('/routes', function(req,res){ res.json(app.routes)}); //print all possible routes
}
module.exports.disable = false;
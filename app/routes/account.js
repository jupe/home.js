module.exports = function(app){
  
  var user =  require('./../controllers/user');
  var group = require('./../controllers/group');
  var auth =  require('./../middleware/authentication').Middleware;
  
  /* USER ROUTES */
  app.get('/user/me.:format?', auth.me);
  app.get('/session.:format?', auth.session);
  app.get('/user.:format?', user.index);
  app.get('/user/:user.:format?', user.show);
  // restriction area
  app.post('/user', auth.isAdmin, user.create);
  app.put('/user/:user', auth.isAdmin, user.update);
  app.delete('/user/:user', auth.isAdmin, user.remove);
  
  /* GROUP ROUTES */
  app.get('/group.:format?', group.index);
  app.get('/group/:group.:format?', group.show);
  // restriction area
  app.post('/group', auth.isAdmin, group.create);
  app.put('/group/:group', auth.isAdmin, group.update);
  app.post('/group/:group/user/:user', auth.isAdmin, group.addUser);
  app.delete('/group/:group/user/:user', auth.isAdmin, group.removeUser);
  app.delete('/user/:user', auth.isAdmin, group.remove);
  
}
module.exports.disable = false;
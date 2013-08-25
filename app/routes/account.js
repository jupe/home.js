module.exports = function(app, apiurl){
  
  var user =  require('./../controllers/user');
  var group = require('./../controllers/group');
  var auth =  require('./../middleware/authentication').Middleware;
  
  /* USER ROUTES */
  app.get(apiurl+'/api/user/me.:format?', auth.me);
  app.get(apiurl+'/session.:format?', auth.session);
  app.get(apiurl+'/user.:format?', user.index);
  app.get(apiurl+'/user/:user.:format?', user.show);
  app.post(apiurl+'/login', user.login);
  // restriction area
  app.post(apiurl+'/user', auth.isAdmin, user.create);
  app.put(apiurl+'/user/:user', auth.isAdmin, user.update);
  app.delete(apiurl+'/user/:user', auth.isAdmin, user.remove);
  
  /* GROUP ROUTES */
  app.get(apiurl+'/group.:format?', group.index);
  app.get(apiurl+'/group/:group.:format?', group.show);
  // restriction area
  app.post(apiurl+'/group', auth.isAdmin, group.create);
  app.put(apiurl+'/group/:group', auth.isAdmin, group.update);
  app.post(apiurl+'/group/:group/user/:user', auth.isAdmin, group.addUser);
  app.delete(apiurl+'/group/:group/user/:user', auth.isAdmin, group.removeUser);
  app.delete(apiurl+'/user/:user', auth.isAdmin, group.remove);
  
}
module.exports.disable = false;
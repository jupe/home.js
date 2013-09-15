module.exports = function(app, apiurl){
  var admin = require('./../controllers/admin');
  var upgrade = require('./../controllers/upgrade');
  var auth = require('./../middleware/authentication').Middleware;
  
  
  app.get(apiurl+'/admin/configure', admin.configure);
  app.put(apiurl+'/admin/configure', [auth.isAdmin], admin.update);
  
  
  app.get(apiurl+'/admin/upgrade.:format?', upgrade.versions);
  app.post(apiurl+'/admin/upgrade.:format?', auth.isAdmin, upgrade.upgrade);
  app.post(apiurl+'/admin/reboot.:format?', auth.isAdmin, upgrade.reboot);
  app.get(apiurl+'/admin/commit.:format?', upgrade.commit);
  
  app.resource(apiurl.substr(1)+'/admin/addon', require('./../resources/addon'));
}

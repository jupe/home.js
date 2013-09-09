module.exports = function(app, apiurl){
  var admin = require('./../controllers/admin');
  var auth = require('./../middleware/authentication').Middleware;
  
  app.get(apiurl+'/admin/configure', admin.configure);
  app.put(apiurl+'/admin/configure/:configure', auth.isAdmin, admin.update);
  app.get(apiurl+'/admin/configure/:configure.:format?', admin.get);
  app.get(apiurl+'/admin/upgrade.:format?', admin.versions);
  app.post(apiurl+'/admin/upgrade.:format?', auth.isAdmin, admin.upgrade);
  app.post(apiurl+'/admin/reboot.:format?', auth.isAdmin, admin.reboot);
  app.get(apiurl+'/admin/commit.:format?', admin.commit);
  
  app.resource(apiurl.substr(1)+'/admin/addon', require('./../resources/addon'));
}
module.exports.disable = false;

module.exports = function(app, apiurl){
  var admin = require('./../controllers/admin');
  
  app.get(apiurl+'/admin/configure', admin.configure);
  app.put(apiurl+'/admin/configure/:configure', admin.update);
  app.get(apiurl+'/admin/configure/:configure.:format?', admin.get);
  app.get(apiurl+'/admin/upgrade.:format?', admin.versions);
  app.post(apiurl+'/admin/upgrade.:format?', admin.upgrade);
  app.post(apiurl+'/admin/reboot.:format?', admin.reboot);
  app.get(apiurl+'/admin/commit.:format?', admin.commit);
}
module.exports.disable = false;

module.exports = function(app){
  var admin = require('./../controllers/admin');
  
  app.get('/admin/configure', admin.configure);
  app.put('/admin/configure/:configure', admin.update);
  app.get('/admin/configure/:configure.:format?', admin.get);
  app.get('/admin/upgrade.:format?', admin.versions);
  app.post('/admin/upgrade.:format?', admin.upgrade);
  app.post('/admin/reboot.:format?', admin.reboot);
  app.get('/admin/commit.:format?', admin.commit);
}
module.exports.disable = false;

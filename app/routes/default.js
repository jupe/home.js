module.exports = function(app,apiurl){
  var defaults = require('./../controllers/defaults');
  app.get('/', defaults.index);
  //app.post('/login', defaults.login);
  app.get('/logout', defaults.logout);
  app.get(apiurl+'/logout', defaults.logout);
  
  app.get('/routes', function(req,res){ res.json(app.routes)}); //print all possible routes
  
  app.get( '/argv', function( req, res){
    res.json( app.get('argv') );
  });
  app.get( '/shutdown', function(req, res, next){
    if( req.query.secret === 'secret' ){
      res.json({shutdown: 'on progress'});
      setTimeout( process.exit, 1000);
    } else next();
  });
  
  //API description
  app.get( apiurl, function(req, res){
    res.json({
      v: 0,
      api: {
        admin: [
          {GET: {href: apiurl+'/admin/configure'}},
          {PUT: {href: apiurl+'/admin/configure/:configure'}},
          {GET: {href: apiurl+'/admin/configure/:configure.:format?'}},
          {GET: {href: apiurl+'/admin/upgrade.:format?'}},
          {POST: {href: apiurl+'/admin/upgrade.:format?'}},
          {POST: {href: apiurl+'/admin/reboot.:format?'}},
        ],
        devices: {
          href: apiurl+'/devices',
          type: 'RESTful',
          data: { 
            href: apiurl+'/device/data',
            type: 'RESTful',
          },
          events: { 
            href: apiurl+'/device/event',
            type: 'RESTful'
          }
        },
        events: {
          href: apiurl+'/event',
          type: 'RESTful',
        },
        actions: {
          href: apiurl+'/action',
          type: 'RESTful'
        },
        rules: {
          href: apiurl+'/rule',
          type: 'RESTful'
        },
        schedule: {
          href: apiurl+'/schedule',
          type: 'RESTful'
        }
      }
    });
  });
}
module.exports.disable = false;
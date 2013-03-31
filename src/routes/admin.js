/*
 * Default routes
 */
var nconf = require('nconf');
var Db = require("../resources/database");
db = new Db();
nconf.use('file', { file: './config.json' });
nconf.load();
var autorize = function(req,res,next)
{
  /*
  if( !req.session.user )
  {
    res.send(403, 'restricted location');
    return;
  }
  if( req.session.user.groups.index('admin') == -1 )
  {
    res.send(403, 'restricted location');
    return;
  }*/
  next(req,res);
}
 
exports.configure = function(req, res){
  
  autorize(req, res, function(req,res){  
      res.render('admin.configure.jade', { 
        user: req.session.user
      });
  });
}
exports.get = function(req, res){
    console.log(req.params);
  autorize(req, res, function(req,res){
      if( db.configures[ req.params.configure ] )
      { 
          db.configures[ req.params.configure ].get( function(err,data){
                if( err ){
                    res.send(403, err);
                } else {
                    res.json(data);
                } 
          });
      } else if( req.params.configure == 'mongodb' ){
        res.json( require('./../config.json').mongodb );
      } else {
        res.send(403, '');
      }
  });
}
exports.update = function(req, res){
  autorize(req, res, function(req,res){
      if( db.configures[ req.params.configure ] )
      { 
            db.configures[ req.params.configure ].update( req.body, function(err,ok){
                if( err ){
                    res.send(403, err);
                } else if(ok){
                    res.json({ok: ok});
                } else {
                    res.send(404);
                }
          });
      } else if( req.params.configure == 'mongodb' ){
        console.log("update mongodb");
        console.log(req.body);
        for( var key in req.body )
        {
            console.log(key);
            console.log(req.body[key]);
            nconf.set('mongodb:'+key, req.body[key] );
        }
        nconf.save(function (err) {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log('Configuration saved successfully.');
            res.json({ok: 1});
            
          });
      } else {
          res.send(403);
      }
  });
}
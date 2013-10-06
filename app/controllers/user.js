
exports.index = function(req, res){
  switch( req.params.format ){
    case( 'json' ):
    default:
      db.user.query( req.query, function(error, list){
        res.json(list);
      });
  }
}
exports.show = function(req, res){
  console.log('show user');
  db.group.find( {users: req.params.user}, function( error, groups){
    db.user.findOne( {name: req.params.user}, function(error, user){
      if(error){
        res.json(404, {error: error});
      } else if(user) {
        user = user.toObject();
        delete user.password;
        user.group = [];
        for(var i in groups){
          user.group.push(groups[i].name);
        }
        res.json(user);
      } else {
        res.json(404, {});
      }
    });
  });
}
exports.login = function(req, res, next){
  
  db.group.find( {users: req.body.name}, function( error, groups){
    if( error ){
      console.log('unknown error');
      res.json(403, {error: error});
    } else {
      db.user.findOne({name: req.body.name}, function( error, doc){
        if( error ){
          console.log('unknown error2');
          res.json(404, {error: error});
        } else if( doc ) {
          var user = doc.toObject();
          user.group = [];
          for(var i in groups){
            user.group.push(groups[i].name);
          }
          doc.comparePassword( req.body.password, function(ok){
            if(ok){
              db.event.store({type: 'info', 'source.component': 'user', msg: user.name+' login success'});
              console.log('pwd valid' .green);
              req.createSession( user, function(msg){
                res.json(user);
              });
            } else {
              db.event.store({type: 'info', 'source.component': 'user', msg: user.name+' login fail', details: 'pwd not match'});
              console.log('pwd invalid'.red);
              res.json(403, {note: 'pwd not match'});
            }
          });
        } else {
          res.json(403, {note: 'user not found'});
        }
      });
    }
  });
  
}
exports.create = function(req, res){
  db.user.findOrCreate({name: req.body.name}, req.body, function(error, doc, _new){
    if(error){
      res.json(404, {error: error});
    } else {
      /*if(_new){
        res.json(404, {error: error});
      } else {*/
        res.json(doc);
      //}
    }
  });
}
exports.update = function(req, res){
  if( req.params.user === 'admin' ) {
    if( req.body.name ) delete req.body.name; //avoid update admin name
  }
  db.user.findOneAndUpdate( {name: req.params.user}, req.body, function(error, user){
    if(error){
      res.json(404, {error: error});
    } else if(user) {
      res.json(user);
    } else {
      res.json(404, {});
    }
  });
}
exports.remove = function(req, res){
  if( req.params.user === 'admin' ) {
    res.json(404, {error: 'cant remove admin user'});
  } else {
    db.user.remove( {name: req.params.user}, function(error, ok){
      if(error){
        res.json(404, {error: error});
      } else if(ok) {
        res.json({ok: ok});
      } else {
        res.json(404);
      }
    });
  }
}

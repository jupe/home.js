
exports.index = function(req, res){
  switch( req.params.format ){
    case( 'json' ):
    default:
      db.user.find( req.query, function(error, list){
        res.json(list);
      });
  }
}
exports.show = function(req, res){
  db.group.find( {users: req.params.user}, function( error, groups){
    db.user.findOne( {name: req.params.user}, function(error, user){
      if(error){
        res.json(404, {error: error});
      } else if(user) {
        user = user.toObject();
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
exports.create = function(req, res){
  db.user.store( req.body, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else {
      res.json(doc);
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

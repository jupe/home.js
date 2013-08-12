
exports.index = function(req, res){
  switch( req.params.format ){
    case( 'json' ):
    default: 
      db.group.find( req.query, function(error, list){
        res.json(list);
      });
  }
}
exports.show = function(req, res){
  db.group.findOne( {name: req.params.group}, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else if(doc) {
      res.json(doc);
    } else {
      res.json(404, {});
    }
  });
}
exports.create = function(req, res){
  db.user.create( req.body, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else {
      res.json(doc);
    }
  });
}
exports.update = function(req, res){
  if( req.params.group === 'admin' ){
    if( req.body.name ) delete req.body.name; //avoid update admin name
  }
  db.group.findOneAndUpdate( {name: req.params.group}, req.body, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else if(doc) {
      res.json(doc);
    } else {
      res.json(404, {});
    }
  });
}
exports.remove = function(req, res){
  if( req.params.group === 'admin' ) {
    res.json(404, {error: 'cant remove admin group'});
  } else {
    db.group.remove( {name: req.params.group}, function(error, ok){
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
exports.addUser = function(req, res){
  db.group.findOneAndUpdate( {name: req.params.group}, {$addToSet :{ users: req.params.user}}, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else if(doc) {
      res.json(doc);
    } else {
      res.json(404);
    }
  });
}
exports.removeUser = function(req, res){
  db.group.findOneAndUpdate( {name: req.params.group}, {$pull :{ users: req.params.user}}, function(error, doc){
    if(error){
      res.json(404, {error: error});
    } else if(doc) {
      res.json(doc);
    } else {
      res.json(404);
    }
  });
}
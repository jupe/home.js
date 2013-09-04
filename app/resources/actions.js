/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
*/

exports.index = function(req, res){
  console.log('actions index');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        db.action.query(req.query, function(err, actions){
          if (error) {
              res.json(500, {error: error});
          } else {
            res.json( actions );
          }
        });
        break;
    default: res.send(501); //Not Implemented
  }
};
exports.create = function(req, res){
  console.log('create actions');
  db.action.store(req.body, function(err, action){
    if( err ){
        res.json(403, {error: err});
    } else if(action){
        res.json(action);
    }
  });
};

exports.show = function(req, res){
  console.log('show actions');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        console.log("find actions");
        db.action.findOne({uuid: req.params.action}, function(err, action){
            res.json( action );
        });
        break;
    default: res.send(501); //Not Implemented
  }
  
};

exports.update = function(req, res){
  console.log('update action ');
  console.log(req.body);
  console.log(req.params);
  db.action.update( {uuid: req.params.action}, req.body, function(err, ok){    
    console.log(ok);
    if( err ){
        console.log(err);
        res.json(403);
    } else if(ok){
        res.json({ok: ok});
    } else {
        res.json(403);
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy schedule ');
  console.log(req.params);
  db.action.remove( {uuid: req.params.action}, function(err, ok){
    if( err ){
        console.log(err);
        res.send(403);
    } else if(ok){
        res.json({ok: ok});
    } else {
        res.send(403);
    }
  });
};
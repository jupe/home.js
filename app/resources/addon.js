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
  console.log('addon index');
  
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        console.log("find addons");
        db.addon.query(req.query, function(err, addons){
            res.json( addons );
        });
        break;
    default: 
      res.send(501); //Not Implemented
      break;
  }
};

exports.new = function(req, res){
  res.json(db.addon.jsonform());
}
exports.create = function(req, res){
  console.log('create schedule');
  db.addon.store( req.body, function(error, doc){
    res.json(doc);
  });
};

exports.show = function(req, res){
  console.log('show schedule');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        console.log("find addons");
        db.addon.findOne({uuid: req.params.schedule}, function(err, addon){
            res.json( addon );
        });
        break;
    default: res.render(501); break;
  }
};


exports.update = function(req, res){
  console.log('update addon');
  db.addon.findOneAndUpdate( {uuid: req.params.addon}, req.body, function(err, doc){    
    if( err ){
      res.send(403);
      console.log(err);
    } else {
      res.json(doc);
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy addon');
  console.log(req.params);
  db.addon.remove( {uuid: req.params.addon}, function(error, ok){    
    if (error) {
        console.log(error);
        res.json(500, {error: error});
    }
		else if (ok) {res.json({});}
		else {res.json(404, {});}
  });
};
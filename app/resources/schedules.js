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
  console.log('schedule index');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        console.log("find schedules");
        db.schedule.query(req.query, function(err, schedules){
            res.json( schedules );
        });
        break;
    default: 
      res.send(501); //Not Implemented
      break;
  }
};


exports.create = function(req, res){
  console.log('create schedule');
  console.log(req.params);
  db.schedule.create( req.body, function(error, doc){
    res.json(doc);
  });
};
exports.new = function(req, res){
  res.json(db.schedule.jsonform());
}
exports.show = function(req, res){
  console.log('show schedule');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('json'):
        console.log("find schedules");
        db.schedule.findOne({uuid: req.params.schedule}, function(err, schedule){
            res.json( schedule );
        });
        break;
    default: res.render(501); break;
  }
  
};


exports.update = function(req, res){
  console.log('update schedule');
  db.schedule.findOneAndUpdate( {uuid: req.params.schedule}, req.body, function(err, doc){    
    if( err ){
      res.send(403);
      console.log(err);
    } else {
      res.json(doc);
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy schedule ');
  console.log(req.params);
  db.schedule.remove( {uuid: req.params.schedule}, function(error, ok){    
    if (error) {
        console.log(error);
        res.send(500, error);
    }
		else if (ok) {res.send(200);}
		else {res.send(404);}
    });
};
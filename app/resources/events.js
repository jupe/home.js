/*
GET     /events             ->  index
GET     /events/new          ->  new
POST    /events              ->  create
GET     /events/:item       ->  show
GET     /events/:item/edit  ->  edit
PUT     /events/:item       ->  update
DELETE  /events/:item       ->  destroy
*/

exports.index = function(req, res){
  switch (req.params.format) {
    case (undefined):
    case ('json'):
        db.event.query(req.query, function (error, results) {
          if (error) {
            res.json(500, {error: error});
          } else {
            res.json(results);
          }
        });
        break;
    default:
        res.render(501, {user: req.session.user}); //Not Implemented
        break;
	}
};

exports.new = function(req, res){
  console.log('new events');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function(req, res){
  console.log('create events');
  console.log(req.params);
  db.event.create( req.body, function(error, doc){
    if (error) {
      res.json(500, {error: error});
    } else {
      res.json(doc);
    }
  });
};

exports.show = function(req, res){
  console.log('show events ');
  console.log(req.params);
  db.event.find( {uuid: req.params.uuid}, function(error, doc){
    if (error) {
      res.json(500, {error: error});
    } else {
      res.json(doc);
    }
  });
};

exports.edit = function(req, res){
  console.log('edit events ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.update = function(req, res){
  console.log('update event ');
  db.event.findAndUpdate( { uuid: req.params.event}, function(error, doc){
    if (error) {
      res.json(500, {error: error});
    } else {
      res.json(doc);
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy event ');
  db.event.remove({ uuid: req.params.event}, function(error, ok){
    if (error) {
      res.json(500, {error: error});
    } else if(ok){
      res.json({});
    }else {
      res.json(303, {});
    }
  });
};
/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
 */


exports.index = function (req, res) {
  
  if( req.params.device ){
    req.query.device = req.params.device;
  }
  
	switch (req.params.format) {
    case (undefined):
    case ('json'):
        db.rule.query(req.query, function (error, results) {
          if (error) {
              console.log(error);
              res.send(500, error);
          } else {
            res.json(results);
          }
        });
        break;
    default:
        res.send(501); //Not Implemented
        break;
	}
};
exports.new = function(req, res){
  res.json(db.rule.jsonform());
}
exports.create = function (req, res) {
	console.log('create rule');
	console.log(req.params);
	console.log(req.body);
  var data = req.body;
  if( req.params.device ){
    data.device = req.params.device;
  }
	db.rule.store(data, function (error, rule) {
		if (error) {
        res.json(500, {error: error});
    } else if (rule) {
      res.json(rule);
    } else {
      res.json(400, {error: 'unknown'});
    }
	});
};

exports.show = function (req, res, next) {
	console.log('show rule');
	console.log(req.params);
	switch (req.params.format) {
        case (undefined):
        case ('json'):
            console.log("get json rules");
            db.rule.findOne({uuid: req.params.rule}, function (error, rule) {
                if (error) {
                    console.log(err);
                    res.json(err);
                } else if(rule) {
                  res.json(rule);
                } else {
                    console.log("NotFound");
                    res.send(404);
                    //next();
                }
            });
            break;
        default:
            res.send(501); //Not Implemented
            break;
	}
}
exports.update = function (req, res) {
	console.log('update rule '+req.params.rule);
	db.rule.findOneAndUpdate( {uuid: req.params.rule}, req.body, function(error, doc){    
      if (error) {
        console.log(error);
        res.send(500, error);
      }
      else if (doc) {res.json(doc);}
      else {res.json(400, {error: 'Not found'});}
  });
};

exports.destroy = function (req, res) {
	console.log('destroy resource ');
	console.log(req.params);
	db.rule.remove( {uuid: req.params.rule}, function(error, ok){    
    if (error) {
        console.log(error);
        res.send(500, error);
    }
		else if (ok) {res.send(200);}
		else {res.send(404);}
    });
};

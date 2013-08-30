/*
GET     /device/:device/event              ->  index
POST    /device/:device/event              ->  create
GET     /device/:device/event/:event       ->  show
PUT     /device/:device/event/:event       ->  update
DELETE  /device/:device/event/:event       ->  destroy
 */

exports.index = function (req, res) {
	switch (req.params.format) {
    case (undefined):
    case ('json'):
        db['device.event'].find(req.query, function (error, results) {
          if (error) {
              console.log(error);
              res.json(500, {error: error});
          } else {
              if( results.length == 0) {
                res.json(404, results);
              } else {
                res.json(results);
              }
          }
        });
        break;
    default:
        res.render(501, {user: req.session.user}); //Not Implemented
        break;
	}
};
exports.create = function (req, res) {
	console.log('create device event');
	db['device.event'].store(req.body, function (error, event) {
		if (error) {
        res.json(500, {error: error});
    } else if (event) {
      res.json(event);
    } else {
      res.send(400);
    }
	});
};

exports.show = function (req, res, next) {
	console.log('show device');
	console.log(req.params);
	switch (req.params.format) {
        case (undefined):
        case ('json'):
            console.log("get json devices");
            db['device.event'].findOne({uuid: req.params.event}, function (error, event) {
                if (error) {
                    console.log(err);
                    res.json(err);
                } else if(event) {
                    res.json(event);
                } else {
                  console.log("NotFound");
                  res.send(404);
                }
            });
            break;
        default:
            res.render(501, {user: req.session.user}); //Not Implemented
            break;
	}
};
exports.update = function (req, res) {
	console.log('update device event '+req.params.device);
	db['device.event'].findOneAndUpdate( {device: req.params.device, uuid: req.params.event}, req.body, function(error, doc){    
      if (error) {
        console.log(error);
        res.send(500, error);
      }
      else if (doc) {res.json(doc);}
      else {res.json(400, {error: 'Not found'});}
  });
};

exports.destroy = function (req, res) {
	console.log('destroy device event');
	db['device.event'].remove( {uuid: req.params.event}, function(error, ok){    
    if (error) {
        res.json(500, {error: error});
    }
		else if (ok) {res.json({});}
		else {res.json(404, {error: 'not found'});}
    });
};
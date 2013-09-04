/*
GET     /device/:device/data              ->  index
POST    /device/:device/data              ->  create
GET     /device/:device/data/:data       ->  show
PUT     /device/:device/data/:data       ->  update
DELETE  /device/:device/data/:data       ->  destroy
 */

exports.index = function (req, res) {
	switch (req.params.format) {
    case (undefined):
    case ('json'):
        db['device.data'].query(req.query, function (error, results) {
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
exports.create = function (req, res) {
	console.log('create device data');
  var data = req.body;
	db.device.findOne( {uuid: req.params.device}, function(error, device) {
    if (error) {
        res.json(500, {error: error});
    } else if( device ) {
      data.device = device.uuid;
      db['device.data'].store(data, function (error, doc) {
        if (error) {
            res.json(500, {error: error});
        } else if (doc) {
          res.json(doc);
          /** @todo not implemented yet */
          /*for(var i=0;i<device.funcs.length;i++){
            if( eval( device.funcs[i].comparision ) ) {
              console.log( 'Start execute action: '+device.funcs[i].action );
              
            }
          }*/
        } else {
          res.json(400, {error: 'Data storage fails'});
        }
      });
    } else {
      res.json(400, {error: 'Device not found'});
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
            db['device.data'].findOne({uuid: req.params.data}, function (error, data) {
                if (error) {
                    console.log(err);
                    res.json(err);
                } else if(data) {
                    res.json(data);
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
	console.log('update device data '+req.params.device);
	db['device.data'].findOneAndUpdate( {device: req.params.device, uuid: req.params.data}, req.body, function(error, doc){    
      if (error) {
        console.log(error);
        res.send(500, error);
      }
      else if (doc) {res.json(doc);}
      else {res.json(400, {error: 'Not found'});}
  });
};

exports.destroy = function (req, res) {
	console.log('destroy device data');
	db['device.data'].remove( {uuid: req.params.data}, function(error, ok){    
    if (error) {
        res.json(500, {error: error});
    }
		else if (ok) {res.json({});}
		else {res.json(404, {error: 'not found'});}
  });
};
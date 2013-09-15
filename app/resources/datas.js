/*
GET     /device/:device/data              ->  index
POST    /device/:device/data              ->  create
GET     /device/:device/data/:data       ->  show
PUT     /device/:device/data/:data       ->  update
DELETE  /device/:device/data/:data       ->  destroy
 */

exports.index = function (req, res) {
	if(!req.query.f)
    req.query.f = 'metadata createdAt updatedAt';
  
  switch (req.params.format) {
    case (undefined):
    case ('json'):
        db.device.findOne({uuid: req.params.device}, 
         function(error, device){
          req.query['metadata.device'] = device._id;
          db.data.query(req.query, function (error, results) {
            if (error) {
              res.json(500, {error: error});
            } else {
              res.json(results);
            }
          });
        });
        break;
    default:
        res.render(501, {user: req.session.user}); //Not Implemented
        break;
	}
}
exports.array = function(req, res){
  
  db.device.findOne({uuid: req.params.device}, 
    function(error, device){
    
    req.query.s = '{"metadata.date":1}'
    req.query['metadata.device'] = device._id;
    if( req.params.resolution == 'daily')
      req.query.f = 'daily metadata'
    else if( req.params.resolution == 'hourly')
      req.query.f = 'hourly metadata'
    else if( req.params.resolution == 'minute')
      req.query.f = 'minute metadata'
    
    db.data.query(req.query, function (error, results) {
      if (error) {
        res.json(500, {error: error});
      } else {
        //var results = doc.toObject();
        var data = [];
        results.forEach( function(result){
          var ts = result.metadata.date;
          if(result.daily){
            var value = result.daily;
            if( result.daily!=0 && value != NaN){
              var stamp = new Date(ts.getFullYear(), ts.getMonth()+1, ts.getDate(), 0);
              if( typeof(value) == 'number' &&
                  stamp instanceof Date ){
                var row = [stamp, value];
                data.push(row);
              }
            }
          } 
          else if(result.hourly){
            Object.keys(result.hourly).forEach(function(key){
              if( result.hourly.hasOwnProperty(key) && parseInt(key)!==NaN){
                var value = result.hourly[key];
                var i = parseInt(key);
                if( value!=0 && value != NaN){
                  var stamp = new Date(ts.getFullYear(), ts.getMonth()+1, ts.getDate(), i);
                  if( typeof(value) == 'number' &&
                      stamp instanceof Date ){
                    var row = [stamp, value];
                    data.push(row);
                  }
                }
              }
            });
          } else if(results.minutes){
          }
        });
        res.json(data);
      }
    });
  });
}
exports.create = function (req, res) {
	console.log('create data');
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
            db['data'].findOne({uuid: req.params.data}, function (error, data) {
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
	console.log('update data '+req.params.device);
	db['data'].findOneAndUpdate( {device: req.params.device, uuid: req.params.data}, req.body, function(error, doc){    
      if (error) {
        console.log(error);
        res.send(500, error);
      }
      else if (doc) {res.json(doc);}
      else {res.json(400, {error: 'Not found'});}
  });
};

exports.destroy = function (req, res) {
	console.log('destroy data');
	db['data'].remove( {uuid: req.params.data}, function(error, ok){    
    if (error) {
        res.json(500, {error: error});
    }
		else if (ok) {res.json({});}
		else {res.json(404, {error: 'not found'});}
  });
};
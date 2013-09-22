/*
GET     /device/:device/sensor/:sensor/timeserie             ->  index
POST    /device/:device/sensor/:sensor/timeserie             ->  create
GET     /device/:device/sensor/:sensor/timeserie/:data       ->  show
PUT     /device/:device/sensor/:sensor/timeserie/:data       ->  update
DELETE  /device/:device/sensor/:sensor/timeserie/:data       ->  destroy

GET     /timeserie             ->  show all
PUT     /timeserie/:sensor     ->  push new value
GET     /timeserie/:sensor     ->  show individual date
DELETE  /timeserie/:sensor     ->  destroy //remove all by sensor uuid
 */

exports.index = function (req, res) {
  if(!req.query.f){
    //limit fields to fetch
    req.query.f = 'metadata createdAt updatedAt';
  }
  console.log('timeseries index');
  switch (req.params.format) {
    case (undefined):
    case ('json'):
        if( req.params.sensor ){
          //sensor parameter is given, filter by it
          req.query['metadata.sensor'] = req.params.sensor;
        } if( req.params.device ){
          //sensor parameter is given, filter by it
          req.query['metadata.device'] = req.params.device;
        }
        db.timeseries.query(req.query, function (error, results) {
          if (error) {
            res.json(500, {error: error});
          } else {
            res.json(results);
          }
        });
        break;
    default:
        res.send(501, {user: req.session.user}); //Not Implemented
        break;
	}
}
exports.array = function(req, res){
  
  req.query.s = '{"metadata.date":1}'
  req.query['metadata.sensor'] = req.params.sensor;
  if( req.params.resolution == 'daily')
    req.query.f = 'daily metadata'
  else if( req.params.resolution == 'hourly')
    req.query.f = 'hourly metadata'
  else if( req.params.resolution == 'minute')
    req.query.f = 'minute metadata'
  
  db.timeseries.query(req.query, function (error, results) {
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
}
/*
exports.create = function (req, res) {
  console.log('create timeserie');
  var timeserie = req.body;
  db.timeserie.store(timeserie, function (error, doc) {
    if (error) {
        res.json(500, {error: error});
    } else if (doc) {
      res.json(doc);
      /** @todo not implemented yet */
      /*for(var i=0;i<device.funcs.length;i++){
        if( eval( device.funcs[i].comparision ) ) {
          console.log( 'Start execute action: '+device.funcs[i].action );
          
        }
      }
    } else {
      res.json(400, {error: 'Data storage fails'});
    }
  });
};
*/
exports.show = function (req, res, next) {
	console.log('show device');
	console.log(req.params);
	switch (req.params.format) {
        case (undefined):
        case ('json'):
            db.timeseries.findOne({'metadata.sensor': req.params.timeserie}, function (error, data) {
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
  if( !req.body.value || !req.body.date){
    console.log(req.body);
    res.json(400, {error: 'invalid data'});
    return;
  }
  //date should be valid
  var date = new Date(req.body.date);
  if (!date || date.getFullYear()<2010 || date.getFullYear()>2050) {
    res.json(400, {error: 'invalid date'});
    return;
  }
  
  var toDate = function(v){
    return Math.round(v/60000/60/24)*60000*60*24;
  }
  db.timeseries.findOrCreate( 
    {'metadata.sensor': req.params.timeserie, 
     'metadata.date': toDate(req.body.date)
    }, 
    { metadata: {
        sensor: req.params.timeserie, 
        date: toDate(req.body.date)
      }
    }, 
    function(error, doc, isNew){    
      if (error) {
        winston.error(error);
        res.json(500, {error: error});
      } else if (doc) {
        doc.push( req.body.date, req.body.value, function(error, data){
          if(error){
            res.json(500, {error: error});
          } else {
            res.json({ok: 1});
          }
        });
        
      }
      else {res.json(400, {error: 'Not found'});}
  });
};

exports.destroy = function (req, res) {
  db.timeseries.remove( {'metadata.sensor': req.params.timeserie}, function(error, ok){    
    if (error) {
      res.json(500, {error: error});
    }
    else if (ok) {res.json({});}
    else {res.json(404, {error: 'not found'});}
  });
};
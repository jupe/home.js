/* Service controller functions */
exports.index = function(req, res){
  db.service.query(req.query, function(error, data){
    if(error){
      res.json(500, {error: error});
    } else {
      res.json(data);
    }
  });
}
exports.operation = function(req, res){
  //authorization zone
  console.log(req.params);
  db.service.findOne( {name: req.params.service }, function(error, service){
    if(error) {
      res.json(500, {error: error});
    } else if( global.service[req.params.service] && service) {
      if( global.service[req.params.service][req.params.operation] ) {
        //if service operation gives direct response, send it to client
        // otherwise send callback response.
        var ret = global.service[req.params.service][req.params.operation](req.query, 
          function(error, resp){
          if(error){
            res.json(500, {error: error});
          } else {
            res.json(resp);
            if( req.params.operation == 'start' ){
              service.enable = true;
              service.save();
            } else if(req.params.operation == 'stop'){
              service.enable = false;
              service.save();
            }
          }
        });
        if( ret ) {
          res.json( ret );
          if( req.params.operation == 'start' ){
            service.enable = true;
            service.save();
          } else if(req.params.operation == 'stop'){
            service.enable = false;
            service.save();
          }
        }
      } else {
        res.json(404, {error: 'service operation not found'});
      }
    } else {
      res.json(404, {error: 'service not found'});
    }
  });
}
exports.status = function(req, res){
  if( service[req.params.service] ) {
    if( service[req.params.service].status ) {
      db.service.findOne( {name: req.params.service }, function(error, obj){
        if(error){
          res.json(500, {error: error});
        } else if( obj ){
          var doc = obj.toObject();
          doc.status = service[req.params.service].status(req.query);
          res.json( doc );
        } else {
          res.json(404, {error: 'service not found from db'}); 
        }
      });
    } else {
      res.json(404, {error: 'service operation not found'});
    }
  } else {
    res.json(404, {error: 'service not found'});
  }
}
exports.update = function(req, res){
  //authorization zone
  if( service[req.params.service] ) {
    if(req.body.name) delete req.body.name; //disallow to change name!
    db.service.findOneAndUpdate( {name: req.params.service}, req.body, function(error, doc){
      if(error){
        res.json(500, {error: error});
      } else if( doc ){
        res.json(doc);
      } else {
        res.json(404, {error: 'service not found from db'}); 
      }
    });
  } else {
    res.json(404, {error: 'service not found'});
  }
}
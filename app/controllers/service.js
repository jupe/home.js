/* Service controller functions */
exports.index = function(req, res){
  switch( req.params.format ){
    case( 'json' ):
    default: 
      var json = [];
      for(var key in service ){
        json.push({name: key, href: '/api/v0/service/'+key});
      }
      res.json(json);
  }
}
exports.operation = function(req, res){
  //authorization zone
  if( service[req.params.service] ) {
    if( service[req.params.service][req.params.operation] ) {
      res.json( service[req.params.service][req.params.operation](req.query) );
    } else {
      res.json(404, {error: 'service operation not found'});
    }
  } else {
    res.json(404, {error: 'service not found'});
  }
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
    db.service.findAndUpdate( {name: req.params.service}, req.body, function(error, doc){
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
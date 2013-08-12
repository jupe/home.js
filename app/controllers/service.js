
exports.index = function(req, res){
  switch( req.params.format ){
    case( 'json' ):
    default: 
      var json = [];
      for(var key in service ){
        json.push({name: key, href: '/service/'+key});
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
      res.json( service[req.params.service].status(req.query) );
    } else {
      res.json(404, {error: 'service operation not found'});
    }
  } else {
    res.json(404, {error: 'service not found'});
  }
}

var autorize = function(req,res,next)
{
  /*
  if( !req.session.user )
  {
    res.send(403, 'restricted location');
    return;
  }
  if( req.session.user.groups.index('admin') == -1 )
  {
    res.send(403, 'restricted location');
    return;
  }*/
  next(req,res);
}
 
exports.service = function(req, res){
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
exports.serviceStatus = function(req, res){
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
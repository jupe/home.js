/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
*/
exports.index = function(req, res){
  console.log('resource index');
  console.log(req.params);
  res.render( "charts", {user: req.session.user} );
};

exports.new = function(req, res){
  console.log('new resource');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function(req, res){
  console.log('create resource');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.show = function(req, res){
  console.log('show resource ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.edit = function(req, res){
  console.log('edit resource ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.update = function(req, res){
  console.log('update forum ');
  console.log(req.params);
  res.render(501); //Not Implemented
};

exports.destroy = function(req, res){
  console.log('destroy resource ');
  console.log(req.params);
  res.render(501); //Not Implemented
};
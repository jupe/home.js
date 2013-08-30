/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
*/
setTimeout( function(){
  dataDB.push(new Date(), 3.2, function(err, data){
    if(err)console.log(err);
    if(data)console.log(data.hourly);
  });
}, 100);

exports.index = function(req, res){
  console.log('data index');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.new = function(req, res){
  console.log('new resource');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.create = function(req, res){
  console.log('create resource');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.show = function(req, res){
  console.log('show resource ');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.edit = function(req, res){
  console.log('edit resource ');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.update = function(req, res){
  console.log('update forum ');
  console.log(req.params);
  res.send(501); //Not Implemented
};

exports.destroy = function(req, res){
  console.log('destroy resource ');
  console.log(req.params);
  res.send(501); //Not Implemented
};
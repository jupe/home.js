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
  console.log('schedule index');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('html'):
        res.render('schedules', {user: req.session.user|'null'});
        break;
    case('json'):
        console.log("find schedules");
        db.schedule.find(req.params.query, function(err, schedules){
            res.json( schedules );
        });
        break;
    default: res.render(501, {user: req.session.user}); break;
  }
};

exports.new = function(req, res){
  console.log('new schedule');
  console.log(req.params);
  res.render(501, {user: req.session.user|'null'}); //Not Implemented
};

exports.create = function(req, res){
  console.log('create schedule');
  console.log(req.params);
  db.schedule.create( req.body, function(error, doc){
    res.json(doc);
  });
};

exports.show = function(req, res){
  console.log('show schedule');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('html'):
        //res.render('schedules_show', {uuid: req.params.schedule});
        //res.render(501);
        res.redirect("/schedules", {user: req.session.user|'null'});
        break;
    case('json'):
        console.log("find schedules");
        db.schedule.findOne({uuid: req.params.schedule}, function(err, schedule){
            res.json( schedule );
        });
        break;
    default: res.render(501); break;
  }
  
};

exports.edit = function(req, res){
  console.log('edit schedule');
  console.log(req.params);
  res.render('schedules_edit', {uuid: req.params.schedule, user: req.session.user|'null'});
        
};

exports.update = function(req, res){
  console.log('update schedule ');
  console.log(req.body);
  console.log(req.params);
  db.schedule.update( {uuid: req.params.schedule}, req.body, function(err, ok){    
    if( err ){
        res.send(403);
        console.log(err);
    } else {
        res.json({ok: ok});
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy schedule ');
  console.log(req.params);
  res.render(501, {user: req.session.user|'null'}); //Not Implemented
};
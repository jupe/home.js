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
  console.log('actions index');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('html'):
        res.render('actions', {
            user: req.session.user
        });
        break;
    case('json'):
        console.log("find actions");
        db.action.find(req.params.query, function(err, actions){
            res.json( actions );
        });
        break;
  }
};

exports.new = function(req, res){
  console.log('new actions');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function(req, res){
  console.log('create actions');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.show = function(req, res){
  console.log('show actions');
  console.log(req.params);
  switch( req.params.format )
  {
    case(undefined):
    case('html'):
        res.render('actions_show', {uuid: req.params.action, user: req.session.user});
        break;
    case('json'):
        console.log("find actions");
        db.action.findOne({uuid: req.params.action}, function(err, action){
            res.json( action );
        });
        break;
  }
  
};

exports.edit = function(req, res){
  console.log('edit action ');
  console.log(req.params);
  res.render('actions_edit', {uuid: req.params.action, user: req.session.user});
};

exports.update = function(req, res){
  console.log('update action ');
  console.log(req.body);
  console.log(req.params);
  db.action.update( {uuid: req.params.action}, req.body, function(err, ok){    
    console.log(ok);
    if( err ){
        console.log(err);
        res.send(403);
    } else if(ok){
        res.json({ok: ok});
    } else {
        res.send(403);
    }
  });
};

exports.destroy = function(req, res){
  console.log('destroy schedule ');
  console.log(req.params);
  res.render(501, { user: req.session.user}); //Not Implemented
};
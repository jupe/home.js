/*
GET     /events             ->  index
GET     /events/new          ->  new
POST    /events              ->  create
GET     /events/:item       ->  show
GET     /events/:item/edit  ->  edit
PUT     /events/:item       ->  update
DELETE  /events/:item       ->  destroy
*/

exports.index = function(req, res){
  console.log('events index');
  console.log(req.params);
  switch (req.params.format) {
        case (undefined):
        case ('html'):
            res.render('events', {user: req.session.user});
            break;
        case ('json'):
            console.log("get json events");
            console.log(db);
            db.event.find(req.query, function (error, results) {
                if (error) {
                    console.log(error);
                    res.send(500, error);
                } else {
                    console.log(results.length);
                    res.json(results);
                }
            });
            break;
        default:
            res.render(501, {user: req.session.user}); //Not Implemented
            break;
	}
};

exports.new = function(req, res){
  console.log('new events');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function(req, res){
  console.log('create events');
  console.log(req.params);
  db.event.create( req.body, function(error, doc){
    res.json(doc);
  });
};

exports.show = function(req, res){
  console.log('show events ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.edit = function(req, res){
  console.log('edit events ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.update = function(req, res){
  console.log('update event ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.destroy = function(req, res){
  console.log('destroy event ');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};
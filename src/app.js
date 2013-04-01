/************************************************************
 *
 *   NODE-HOME-AUTOMATION
 *   designed by JVA
 *
 *   Code license: GNU GPL v2
 *
 ************************************************************/
 
/*
 * 
 * Module dependencies.
 */
var express = require('express')
  , Resource = require('express-resource')
  , routes = require('./routes') 
  , http = require('http')
  , path = require('path')
  , cronservice = require("./services/cron.js")
  , email = require('emailjs')
  , SessionStore = require("session-mongoose")(express)
  , conf = require('./config');

var app = express();

var cron = new cronservice();
cron.start();

process.title = 'home.js';

app.configure(function(){
  app.set('port', conf.app.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('ZcLoUd'));
  // mongo session storing - there was some problems with rpi !
  /*var store = new SessionStore({
        url: "mongodb://"+require('./config.json').mongodb.host+"/"+require('./config.json').mongodb.database,
        interval: 120000 // expiration check worker run interval in millisec (default: 60000)
  });*/
  app.use(express.session({
    //store: store,
    cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  //console.log(req.url);
  res.render('404', { status: 404, url: req.url, user: req.session.user });
});
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  /*res.render('500', {
      status: err.status || 500
    , error: err
  });*/
  console.log(err);
  //res.send(404);
  next();
});
app.get('/', routes.index);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/routes', function(req,res){ res.json(app.routes)}); //print all possible routes
var admin = require('./routes/admin');
app.get('/admin/configure', admin.configure);
app.put('/admin/configure/:configure', admin.update);
app.get('/admin/configure/:configure.:format?', admin.get);
app.get('/admin/upgrade.:format?', admin.versions);
app.post('/admin/upgrade.:format?', admin.upgrade);
app.post('/admin/reboot.:format?', admin.reboot);

//app.get('/devices/status', require('./resources/devices').status);
var devices = require('./resources/devices');
app.get('/devices/status.:format?', devices.status);
app.get('/devices/tree.:format?', devices.tree);
app.get('/devices/events.:format?', devices.events);
app.get('/devices/:device/events.:format?', devices.events);
app.post('/devices/:device/events.:format?', devices.newEvent);
var devicesResource = app.resource('devices', devices);


app.get('/mailtest', function(req,res){
    console.log("mailtest..");
    var cfg = require('./config.json').email;
    var server   = email.server.connect( cfg );
    server.send( {
        text: 'test',
        from: cfg.from,
        to: 'jussiva@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: 'Test Email', // REQUIRED.
      }, function (err, message) {
        if (err) {
          // handle error
          console.log(err);
          res.send('There was an error sending the email');
          return;
        }
        res.send(message);
      });
});

//app.resource('meters', require('./resources/meters'));
app.resource('charts', require('./resources/charts'));
app.resource('events', require('./resources/events'));
app.resource('maps', require('./resources/maps'));
app.resource('networks', require('./resources/networks'));
app.resource('schedules', require('./resources/schedules'));
app.resource('actions', require('./resources/actions'));
app.resource('automations', require('./resources/automations'));
app.resource('experts', require('./resources/experts'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

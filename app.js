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
var 
    //node.js modules:
    express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  // 3rd party modules:
  , Resource = require('express-resource')
  , email = require('emailjs')
  , colors = require('colors')
  , SessionStore = require("session-mongoose")(express);

var conf = require('./config').init()
global.CFG = conf;  

/** Load configurations and cronjob */
var cronservice = require("./app/services/cron.js")
  , Db = require("./app/resources/database");
  
var app = express();
var cron = new cronservice();
//cron.start();

global.db = new Db();

// Change process title
process.title = 'home.js';

//change current working directory (required for git pull)
process.chdir(require('path').dirname(require.main.filename)); 

app.configure(function(){
  
  app.set('port', conf.app.port);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  
  app.use(express.logger('dev'));
  app.use(express.compress());
  
  //app.use(express.staticCache());
  
  //these files shouldn't never change
  app.use(express.static(__dirname + '/public', {maxAge: 86400000})); 
  
  
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('HoMeJs'));
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

/**
 * Mount all routes from "routes" -folder.
 */
fs.readdirSync(__dirname + '/app/routes').forEach(function(name){
    var route = require('./app/routes/'+name);
    if( route.disable ){}
    else {
      console.log('Init routes '+name .cyan);
      route(app);
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

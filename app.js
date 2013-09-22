/************************************************************
 *
 *   HOME.JS
 *   designed by JVA
 *
 *   Code license: MIT
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
  , cluster = require('cluster')
  
  // 3rd party modules:
  , mongoose = require('mongoose')
  , Resource = require('express-resource')
  , email = require('emailjs')
  , colors = require('colors')
  , config = require('./config')
  , winston = require('winston')
  //, winstonExpress = require('winston-express')
  , cli = require('optimist')
    .usage('Usage: npm start]')
    
    .boolean(['f', 'd', 'start', 'help', 'stop', 'status', 'restart'])
    
    .default('pidfile', '')
    
    //.demand(['x','y'])
    .default('f', false)
    .alias('f', 'fork')
    
    .alias('f', 'h')
    
    .default('p', 3000)
    .alias('p', 'port')
    
    .default('d', false)
    .alias('d', 'start')
    
    .default('s', false)
    .alias('s', 'silent')
    
  , argv = cli.argv
  , SessionStore = require("session-mongoose")(express)
  
  
  // Own modules
  , services = require('./app/services')
  , Routes = require('./app/routes')
  , Db = require("./app/database")
  //, Daemon = require("./lib/daemon");

//Daemon(cli); 
/*
if( argv.help || argv.h ){
  cli.showHelp();
  process.exit();
}*/

if (cluster.isMaster && argv.fork) {
    var cpus = require('os').cpus().length;
    for (var i = 0; i < cpus; i++) {
        cluster.fork();
    }
    return;
}

if( argv.d ) {
  winston.add(winston.transports.File, 
      { filename: __dirname + '/log/homejs.log',
        colorize: false,
        handleExceptions: true,
        json: false
      }).remove(winston.transports.Console);
}


global.CFG = config.init(argv);
global.winston = winston;

/** Load configurations and cronjob */
var app = express();

app.configure('development', function(){
  winston.info('Initializing development version'.yellow);
  app.use(express.errorHandler());
});
app.configure('production', function(){
  winston.info('Initializing production version'.yellow);
  app.use(express.errorHandler());
});

/* Create database connection */
mongoose.connect( 'mongodb://'+CFG.mongodb.host+':'+CFG.mongodb.port+'/'+CFG.mongodb.database, CFG.mongodb.opts );
mongoose.connection.on('error', function(error){
  winston.error("Failed to connect mongodb");
});
mongoose.connection.on('connected', function(){
 winston.log("Connect mongodb success");
 // Register db models and other db related stuff
 var db = new Db(); 
  
 global.db = db;
 app.set('db', db);
 services();
});


// Change process title
process.title = 'home.js';

//change current working directory (required for git pull)
process.chdir(require('path').dirname(require.main.filename)); 

app.configure(function(){
  
  app.set('argv', argv);
  app.set('port', CFG.app.port);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/app/views');
  
  //winstonExpress(app, winston);
  
  // enable web server logging; pipe those log messages through winston
  var winstonStream = {
      write: function(message, encoding){
        winston.info(message);
      }
  };
  //app.use(express.logger({stream:winstonStream, format: ':remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time' }));
  app.use(express.logger('dev'));
  //app.use(express.compress());
  
  //app.use(express.staticCache());
  
  //Allow cross domain 
  app.use( require('./app/middleware/allowCrossDomain.js') );
  
  //these files shouldn't never change
  app.use(express.static(__dirname + '/app/public'/*, {maxAge: 86400000}*/)); 
  
  
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
    /*cookie: { maxAge: 900000 }*/ // expire session in 15 min or 900 seconds
  }));
  app.use( require('./app/middleware/authentication') );
  app.use(app.router);
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
  //res.send(err.status || 500);
  winston.error(err);
  //res.send(404);
  next();
});

/** Mount all routes from "routes" -folder. */
Routes(app);
/*
process.on('uncaughtException', function(err) {
  var stack = new Error().stack;
  if(err.errno === 'EADDRINUSE'){
    winston.error( ('Sorry, port '+app.get('port')+' is already in use').red);
  } else {
    winston.error('uncaughtException');
    if(err)winston.error(err);
    winston.error( stack )
  }
  process.exit(1);
}); */

// Windows doesn't use POSIX signals
if (process.platform === "win32" && argv.d === false) {
  const keypress = require("keypress");
  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.setEncoding("utf8");
  process.stdin.on("keypress", function(char, key) {
    if (key && key.ctrl && key.name == "c") {
        // Behave like a SIGUSR2
        process.emit("SIGINT");
    }
  });
}
process.on('exit', function() {
  winston.log('About to exit.');
});
process.on('SIGINT', function() {
  //Wait for while for service stops
  setInterval( function(){ process.exit(1)}, 1000 );
});
app.listen(app.get('port'), function(){
  winston.info("home.js server listening on port " + (app.get('port')+'') .green);
});

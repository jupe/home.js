var daemon = require("daemonize2")
   , cli = require('optimist')
    .usage('Usage: [start|stop|kill|restart|reload|status] {options}')
    .boolean(['start', 'stop', 's', 'restart', 'status'])
    .default('pidfile', '')
    .default('d', false)
    .alias('d', 'start')
    
    .default('s', false)
    .alias('s', 'silent')
    
   , argv = cli.argv;

var pidfile = "/var/run/homejs.pid";
if( argv.pidfile != '' ){
  pidfile = argv.pidfile;
}
else if(process.platform === "win32" )
  pidfile = "./homejs.pid";

if( argv.start || argv.restart ){
  process.argv.push('-d');  
}
daemon = daemon.setup({
    main: "app.js",
    name: "home.js",
    pidfile: pidfile,
    silent: true
});


//IF 80 port is used
/*
if( argv.p < 1000 ) {
  if (process.getuid() != 0) {
      console.log("Expected to run as root");
      process.exit(1);
  }
}*/

daemon
    .on("starting", function() {
        if(!argv.silent)console.log("Starting daemon...");
    })
    .on("started", function(pid) {
        if(!argv.silent)console.log("Daemon started. PID: " + pid);
    })
    .on("stopping", function() {
        if(!argv.silent)console.log("Stopping daemon...");
    })
    .on("stopped", function(pid) {
        if(!argv.silent)console.log("Daemon stopped.");
    })
    .on("running", function(pid) {
        if(!argv.silent)console.log("Daemon already running. PID: " + pid);
    })
    .on("notrunning", function() {
        if(!argv.silent)console.log("Daemon is not running");
    })
    .on("error", function(err) {
        if(!argv.silent)console.log("Daemon failed to start:  " + err.message);
    });


if(argv.start)      daemon.start();
else if(argv.stop)  daemon.stop();
else if(argv.kill)  daemon.kill();
else if(argv.restart){
  daemon.stop(function(err) {
      daemon.start();
  });
} else if(argv.reload) daemon.sendSignal("SIGUSR1");
else if(argv.status){
  var pid = daemon.status();
  if (pid){
      if(!argv.silent)console.log("Daemon running. PID: " + pid);
  } else {
      if(!argv.silent)console.log("Daemon is not running.");
  }
} else {
  cli.showHelp();
}
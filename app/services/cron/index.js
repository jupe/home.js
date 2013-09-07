var   email = require('emailjs')
    , cronJob = require('cron').CronJob
    , owservice = require("./../lib/onewire.js");


var CronService = function() {
  var self = this;
  //Create ow service schedule and actions
  var ow = new owservice();
  var timer = false;
  var cronSession = {}
  var statusnow = {
    cron: {active: false, time: new Date()},
    services: []
  }
  var timeZone ="";
  
  var configurations = {
    interval: CFG.app.service.cron.poll_interval
  }

  function event(type, msg, uuid, details){
      var data = {
          msg: msg, details: '', type: type,
          source: { component: 'service', name: 'cron' }
      }
      if( !details ) details = uuid;
      else {
          data.source['uuid']  =uuid;
      }
      data.details = details|'';
      db.event.create( data, function(){});
  }
  //helper function for scripts
  function sendEmail( to, subject, msg, cb){
      var cfg = CFG.email;
      var server  = email.server.connect( cfg );
      server.send( {
          text: msg, from: cfg.from, to: to, subject: subject
        }, function (err, message) {
          if (err) {
            // handle error
            console.log('There was an error sending the email');
            console.log(err);
            event('error', 'sendEmail failed',  err);
            if(cb)cb(err);
          }else {
              console.log('Email sended');
              console.log(message);
              event('info', 'sendEmail', message);
            if(cb)cb(null, message);
          }
        });
  }
  function scheduleActionExecuter( schedule, action, callback ){
      try { 
          //Evaluate action script and run it here
          if( action.enable ){
              console.log( 'start execute action');
              console.log( action.name );
              eval( action.script );
          } else {
              console.log( 'Action was disabled');
          }
          callback();
          cronSession[ schedule.uuid ].timestamp = new Date();
      } catch (arguments) {
          // if evaluate exception occurs, catch it here
          console.log(arguments);
          event('fatal', 'action script '+action.name+' failed', action.uuid, arguments);
          callback(arguments);
      }
  }
  function scheduleEvent( schedule ){
      //schedule Event hanlder
      console.log('scheduleEvent: '+schedule.name);
      db.schedule.update( {uuid: schedule.uuid}, {lastTriggered: new Date()}, function(err, ok){}) ;
      
      
      //Event might contains several actions, so loop all actions here
      for( var i=0;i<schedule.actions.length;i++){
          console.log( "Action: "+schedule.actions[i] );
          db.action.findOne( {uuid: schedule.actions[i]}, function( err, action){
              if( err ){
                  console.log('Error while fetching action');
                  console.log(err);
                  event('fatal', err);
              } else if( action ){
                  // New action found and lets execute action
                  scheduleActionExecuter(schedule, action, function(err, msg){
                      //what about then?
                  });
              } else {
                  console.log('Cant find action!');
              }
          });
      }
  }
  function initSchedule( schedule ){    
      if( schedule.enable && !cronSession[ schedule.uuid ] ){
          console.log("starting cron job..");
          var job = new cronJob(schedule.cron, function(){
              scheduleEvent( schedule );
            }, function () {
              // This function is executed when the job stops
            }, 
            true /* Start the job right now */,
            timeZone /* Time zone of this job. */
          );
          cronSession[ schedule.uuid ] = {
              cron: job,
              timestamp: new Date()
          }
          statusnow.services[schedule.uuid] = cronSession[ schedule.uuid ];
          return 'start';
      } else if( !schedule.enable && cronSession[ schedule.uuid ] ){
          console.log("Stopping cron job..");
          cronSession[schedule.uuid].cron.stop();
          delete cronSession[schedule.uuid];
          delete statusnow.services[schedule.uuid];
          return 'stop';
      }
  }
  
  
  /* Interface functions */
  var start = function(){
      console.log('Start cron service' .cyan + ' . Interval: '+configurations.interval/1000+ ' s.');
      statusnow.cron.active = true;
      statusnow.cron.time = new Date();
      // loop all schedules every 5 second and activate/deactivate if needed..
      timer = setInterval( function(){
          console.log('Check cron schedules');
          db.schedule.find({}, function(err, schedules){
              if( err ) {
                  event('fatal', err);
              } else if( schedules.length > 0 ) {
                  //console.log('Init schedules (n: '+schedules.length+')');
                  for(var i=0;i<schedules.length;i++){
                      initSchedule( schedules[i] );
                  };
              }
          });
      }, configurations.interval);
      return status();
  }
  var stop = function(){
      console.log('Stop cron service' .cyan);
      statusnow.cron.active = false
      statusnow.cron.time = new Date();
      if(self.timer) self.timer.stop();
      self.timer = false;
      for( var key in cronSession ){
          try{ cronSession[key].cron.stop(); }
          catch( ex ) {console.error(ex);}
      }
      return status();
  }
  var status = function(){
    return statusnow;
  }
  var configure = function(cfg){
    if(cfg) self.configurations = cfg;
    return self.configurations;
  }

  /* MODULE API */
  return {
    start: start,
    stop: stop,
    status: status
  }
  
}
// export the class
module.exports = CronService;
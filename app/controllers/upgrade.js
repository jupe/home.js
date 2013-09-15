
var //node modules
    util = require('util')
  , fs = require('fs')
  , exec = require('child_process').exec
  //3rd party modules
  , request = require('request')
  , FeedParser = require('feedparser')
  , uptodate = require('github-update-checker').uptodate;
  
  
exports.commit = function(req,res){
    winston.log('get commit details');
    exec('git rev-parse HEAD', function(error, commit, stderr){
        exec('git show -s --format="%ci"', function(error, timestamp, stderr){
            res.json( {id: commit.trim(), timestamp: new Date(timestamp.trim())} );
        });
    });
}

exports.versions = function(req, res){
  console.log('versions');
  request.get(CFG.app.feed).pipe(new FeedParser())
    .on('error', function(error) {
      // always handle errors
      console.log(error);
      winston.log(error);
      res.json(403, {error: error});
    })
    .on('end', function () {
     // do the next thing
     console.log('data');
     winston.log(new Date(CFG.app.date) );
     if( new Date(CFG.app.date) == 'Invalid Date' ||
         new Date(this.articles[0].date).getTime() >= 
         new Date(CFG.app.date).getTime() ) {
      res.json( {
          uptodate: false, 
          link: this.articles[0].link, 
          title: this.articles[0].title,
          yours: new Date(CFG.app.date) 
      });
     } else {
       res.json( {
          uptodate: true, 
          articles: new Date(this.articles[0].date).getTime(), 
          yours: CFG.app.date 
        });
     }
    });
}
var install = function(cb){
  winston.log('git fetch changes');
  exec('git fetch --all', function(error, stdout, stderr){
    if( error ) {
        winston.log(error);
        cb(error);
    } else {
      winston.log('git reset master');
      exec('git reset --hard origin/master', function(error, stdout, stderr){
        if( error ) {
          winston.log(error);
          cb(error);
        } else {
          winston.log('verify that all dependencies are installed');
          exec('npm install', function(error, stdout, stderr){
            if(error){
              cb(error);
            } else if(stderr){
              cb(stderr);
            } else {
              nconf.set('app:date', new Date() );
              nconf.save(function (err) {});
              cb(null, {success: true});
            }
          });
        }
      });
    }
  });
    
  /*
  // Alternative style is to download package and unzip it, but git is easier to use
  winston.log("unzip "+archive+"...");
  fs.createReadStream(archive)
      .pipe(unzip.Extract({ path: 'download' }))
      .on('error', function(err){
          winston.log('error');
          winston.log(err);
      })
      .on('close', function(){
          winston.log('closed');
          exec('mv ./download/home.js-master ', function(error, stdout, stderr){
          cb(null, {success: true});
          });
      });
      */
}
exports.reboot = function(req, res){
  res.json({ok: 1});
  exec('sudo reboot', function(error, stdout, stderr){});
}
exports.upgrade = function(req, res){
  winston.log('upgrading..');  
  install(function(e,o){
    if(e)res.json(500, {error: e});
    else res.json(o);
  });
    /* 
    // Alternative style is to download package and unzip it, but git is easier to use
    var url = require('./../config.json').app.zip;
    request(url, function (error, response, body){
        if( error ) {
            res.send(500, error);
        } else {
            winston.log('package downloaded');
            install('./download/master.zip', function(e,o){
                if(e)res.send(500, e);
                else res.json(o);
            });
        }
    }).pipe(fs.createWriteStream('./download/master.zip'));
    */
   
}


var updateavailable = function(response){
  if(response===false){
    winston.log('No updates available');
  } else if(response===true){
    winston.info('Update available!');
    db.event.create( {type: 'info', msg: 'update available'}, function(){});
  } else {
    winston.error('Update check error: '+response);
  }
  setTimeout( uptodatecheck, CFG.app.update.period );
}
var uptodatecheck = function(){
  uptodate( {
    url: CFG.app.update.url,
    callback: updateavailable
  });
}
uptodatecheck();
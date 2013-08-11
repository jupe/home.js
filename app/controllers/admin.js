/*
 * Default routes
 */
var nconf = require('nconf');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var request = require('request');
var FeedParser = require('feedparser');

var conf = require('./../../config/config.json');

nconf.use('file', { file: './../../config/config.json' });
nconf.load();

//https://api.travis-ci.org/repositories/jupe/home.js.json

var autorize = function(req,res,next)
{
  /*
  if( !req.session.user )
  {
    res.send(403, 'restricted location');
    return;
  }
  if( req.session.user.groups.index('admin') == -1 )
  {
    res.send(403, 'restricted location');
    return;
  }*/
  next(req,res);
}
 
exports.configure = function(req, res){
  
  autorize(req, res, function(req,res){  
      res.render('admin.configure.jade', { 
        user: req.session.user
      });
  });
}
exports.get = function(req, res){
  winston.log(req.params);
  autorize(req, res, function(req,res){
      if( ['app', 'mongodb', 'owfs', 'email'].indexOf( req.params.configure ) != -1 )
      {
        res.json( require('./../config.json')[req.params.configure] );
      } else {
        res.send(403, '');
      }
  });
}

exports.commit = function(req,res){
    winston.log('get commit details');
    exec('git rev-parse HEAD', function(error, commit, stderr){
        exec('git show -s --format="%ci"', function(error, timestamp, stderr){
            res.json( {id: commit, timestamp: timestamp} );
        });
    });
}

exports.versions = function(req, res){
    url = conf.app.feed;
    request(url).pipe(new FeedParser())
      .on('error', function(error) {
        // always handle errors
        winston.log(error);
        res.send(403);
      })
      .on('end', function () {
       // do the next thing
       winston.log(new Date(conf.app.date) );
       if( new Date(conf.app.date) == 'Invalid Date' ||
           new Date(this.articles[0].date).getTime() >= 
           new Date(conf.app.date).getTime() ) {
        res.json( {
            uptodate: false, 
            link: this.articles[0].link, 
            title: this.articles[0].title,
            yours: new Date(conf.app.date) } );
       } else {
         res.json( {uptodate: true, articles: new Date(this.articles[0].date).getTime(), yours: conf.app.date });
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
                        winston.log(error);
                        winston.log(stdout);
                        winston.log(stderr);
                        cb(null, {success: true});
                    });
                    nconf.set('app:date', new Date() );
                    nconf.save(function (err) {});
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
    autorize(req, res, function(req,res){
        res.json({ok: 1});
        exec('sudo reboot', function(error, stdout, stderr){});
    });
}
exports.upgrade = function(req, res){
    winston.log('upgrading..');
    autorize(req, res, function(req,res){
        install(function(e,o){
            if(e)res.send(500, e);
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
    });
}
exports.update = function(req, res){
  autorize(req, res, function(req,res){
      if( ['app', 'mongodb', 'owfs', 'email'].indexOf( req.params.configure ) != -1 )
      {
        winston.log("update mongodb");
        winston.log(req.body);
        for( var key in req.body )
        {
            winston.log(key);
            winston.log(req.body[key]);
            nconf.set(req.params.configure+':'+key, req.body[key] );
        }
        nconf.save(function (err) {
            if (err) {
              winston.error(err.message);
              return;
            }
            winston.log('Configuration saved successfully.');
            res.json({ok: 1});
            
          });
      } else {
          res.send(403);
      }
  });
}
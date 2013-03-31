/*
 * Default routes
 */
var nconf = require('nconf');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var request = require('request');
var FeedParser = require('feedparser');
var Db = require("../resources/database");
var conf = require('./../config.json');
db = new Db();
nconf.use('file', { file: './config.json' });
nconf.load();



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
    console.log(req.params);
  autorize(req, res, function(req,res){
      if( ['app', 'mongodb', 'owfs', 'email'].indexOf( req.params.configure ) != -1 )
      {
        res.json( require('./../config.json')[req.params.configure] );
      } else {
        res.send(403, '');
      }
  });
}

exports.versions = function(req, res){
    url = conf.app.feed;
    request(url).pipe(new FeedParser())
      .on('error', function(error) {
        // always handle errors
        console.log(error);
        res.send(403);
      })
      .on('end', function () {
       // do the next thing
       if( new Date(this.articles[0].date).getTime() >= 
           new Date(conf.app.date).getTime() ) {
        res.json( {
            uptodate: false, 
            link: this.articles[0].link, 
            title: this.articles[0].title} );
       } else {
         res.json( {uptodate: true});
       }
      });
}
var install = function(archive, cb){
    
    exec('git fetch --all', function(error, stdout, stderr){
        if( error ) {
            cb(error);
        } else {
            exec('git reset --hard origin/master', function(error, stdout, stderr){
                if( error ) {
                    cb(error);
                } else {
                    cb(error, {success: true});
                    nconf.set('app:date', new Date() );
                    nconf.save(function (err) {});
                }
            });
        }
    });
    
    /*
    // Alternative style is to download package and unzip it, but git is easier to use
    console.log("unzip "+archive+"...");
    fs.createReadStream(archive)
        .pipe(unzip.Extract({ path: 'download' }))
        .on('error', function(err){
            console.log('error');
            console.log(err);
        })
        .on('close', function(){
            console.log('closed');
            exec('mv ./download/home.js-master ', function(error, stdout, stderr){
            cb(null, {success: true});
            });
        });
        */
}
exports.upgrade = function(req, res){
    console.log('upgrading..');
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
                console.log('package downloaded');
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
        console.log("update mongodb");
        console.log(req.body);
        for( var key in req.body )
        {
            console.log(key);
            console.log(req.body[key]);
            nconf.set(req.params.configure+':'+key, req.body[key] );
        }
        nconf.save(function (err) {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log('Configuration saved successfully.');
            res.json({ok: 1});
            
          });
      } else {
          res.send(403);
      }
  });
}
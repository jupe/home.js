var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request");

var appurl = 'http://localhost:3000';
var apiurl = appurl+'/api/v0';  

describe('api#0:init', function() {
  
  it('server start as daemon', function(done) {
    this.timeout(5000);
    exec('node index --start --silent --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    })
  });
  
  
  it('[GET] /', function(done) {
    request.get(appurl, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[GET] /argv', function(done) {
    request.get(appurl+'/argv', 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      body = JSON.parse(body);
      assert.equal(body.start, true);
      assert.equal(body.pidfile, 'app.pid');
      assert.equal(body.port, 3000);
      
      done();
    });
  });
  
  it('[GET] /admin/configure', function(done) {
    request.get({json: true, url: apiurl+'/admin/configure'}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.typeOf(body.app, 'object');
      assert.typeOf(body.app.port, 'number');
      assert.equal(body.app.port, 3000);
      assert.typeOf(body.email, 'object');
      assert.typeOf(body.mongodb, 'object');
      done();
    });
  });
  
  it('[PUT] /admin/configure', function(done) {
    request.get({json: true, url: apiurl+'/admin/configure'}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.typeOf(body.app, 'object');
      assert.typeOf(body.app.port, 'number');
      assert.equal(body.app.port, 3000);
      assert.typeOf(body.email, 'object');
      assert.typeOf(body.mongodb, 'object');
      done();
    });
  });
  it('[GET] /admin/commit', function(done) {
    request.get({json: true, url: apiurl+'/admin/commit'}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.typeOf(body.id, 'string');
      assert.typeOf(body.timestamp, 'string');
      done();
    });
  });
  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --stop --silent --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    });
  });
});  
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
      console.log(stdout);
      setTimeout(done, 2000);
    })
  });
  
  
  it('frontpage', function(done) {
    request.get(appurl, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('argv', function(done) {
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
  
  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --stop --silent --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    });
  });
});  
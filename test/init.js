var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request");

describe('init', function() {
  
  it('server start as daemon', function(done) {
    exec('node index --start --silent --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      console.log(stdout);
      done();
    })
  });
  
  
  it('frontpage', function(done) {
    request.get('http://localhost:3000', 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('argv', function(done) {
    request.get('http://localhost:3000/argv', 
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
      done();
    });
  });
});  
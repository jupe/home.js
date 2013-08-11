var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request");

describe('init', function() {
  
  it('server start as daemon', function(done) {
    exec('node index --start --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      console.log(stdout);
      done();
    })
  });
  
  
  it('/device.json', function(done) {
    request.get('http://localhost:3000/device.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('/event.json', function(done) {
    request.get('http://localhost:3000/event.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('/schedule.json', function(done) {
    request.get('http://localhost:3000/schedule.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --stop --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      done();
    });
  });
});  
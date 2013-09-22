var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request").defaults({jar: true});

var appurl = 'http://localhost:3000';
var apiurl = appurl+'/api/v0';

describe('api#3:init', function() {
  it('server start as daemon', function(done) {
    this.timeout(5000);
    exec('node index --silent --start --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      console.log(stdout);
      setTimeout(done, 2000);
    })
  });
});

describe('api#3:timeserie', function() {  
  
  it('[GET] /timeserie', function(done) {
    request.get({json: true, url: apiurl+'/timeserie'}, 
     function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[PUT] /timeserie/:id (success)', function(done) {
    var options = {
      uri: apiurl+'/timeserie/523ec5bd96d06f5c05000005',
      method: 'PUT',
      json: { date: 1376552703162, value: 12.3 }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.equal(body.ok, 1);
      done();
    });
  });
  it('[PUT] /timeserie/:id (invalid date)', function(done) {
    var options = {
      uri: apiurl+'/timeserie/523ec5bd96d06f5c05000005',
      method: 'PUT',
      json: { date: 137655270316, value: 12.3 }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 400);
      assert.typeOf(body, 'object');
      done();
    });
  });
  /*it('[PUT] /timeserie/:id (invalid id)', function(done) {
    var options = {
      uri: apiurl+'/timeserie/523ec5b6d06f5c05000005',
      method: 'PUT',
      json: { date: 1376552703162, value: 12.3 }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 500);
      assert.typeOf(body, 'object');
      done();
    });
  });*/
  it('[GET] /timeserie/:id/hourly (success)', function(done) {
    var options = {
      uri: apiurl+'/timeserie/523ec5bd96d06f5c05000005/hourly',
      json: true
    };
    request.get(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      body.forEach( function(row){
        assert.typeOf(row, 'array');
        assert.equal(row.length, 2);
      });
      done();
    });
  });
});

describe('api#3:stop', function() {  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --silent --stop --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    });
  });
}); 
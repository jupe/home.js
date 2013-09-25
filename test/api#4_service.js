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

describe('api#4:service', function() {  
  
  it('[GET] /service', function(done) {
    request.get({json: true, url: apiurl+'/service'}, 
     function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[GET] /service/:id (success)', function(done) {
    request({json: true, url: apiurl+'/service/ellaweb'}, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.equal(body.name, 'ellaweb');
      assert.equal(body.enable, false);
      done();
    });
  });
  it('[PUT] /service/:id (no access)', function(done) {
    var options = {
      uri: apiurl+'/service/ellaweb',
      method: 'PUT',
      json: { 'configurations.place': 1234 }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      assert.typeOf(body, 'object');
      done();
    });
  });
  it('[POST] /service/:id/start (non access)', function(done) {
    var options = {
      uri: apiurl+'/service/ellaweb/start',
      json: {},
      method: 'POST',
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      assert.typeOf(body, 'object');
      done();
    });
  });
  
  it('[POST] /login (success)', function(done) {
    var options = {
      uri: apiurl+'/login',
      method: 'POST',
      json: { "name": "admin", "password": "admin" }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[PUT] /service/:id (success)', function(done) {
    var options = {
      uri: apiurl+'/service/ellaweb',
      method: 'PUT',
      json: { 'configurations.place': 1234 }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
      assert.equal(body.configurations.place, 1234);
      done();
    });
  });
  it('[POST] /service/:id/start (success)', function(done) {
    var options = {
      uri: apiurl+'/service/ellaweb/start',
      json: {},
      method: 'POST',
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object');
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
var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request").defaults({jar: true});

var appurl = 'http://localhost:3000';
var apiurl = appurl+'/api/v0';
var uuid;
var match = {
  uuid: /[0-f,0-9]{8}-[0-f,0-9]{4}-[0-f,0-9]{4}-[0-f,0-9]{4}-[0-f,0-9]{12}/
}

describe('init', function() {
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


describe('device', function() {  
  
  it('[GET] /device', function(done) {
    request.get({json: true, url: apiurl+'/device.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      if(body.length>0) uuid = body[0].uuid;
      assert.equal( body.length, 0 );
      
      done();
    });
  });
  
  it('[POST] /device (success)', function(done) {
    var options = {
      uri: apiurl+'/device',
      method: 'POST',
      json: {
        name: 'test',
        id: '28.C7DC7A030000',
        protocol: 'ow'
      }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Object' );
      uuid = body.uuid;
      assert.isTrue( body.uuid.match(match.uuid).length==1 );
      assert.equal(body.id, '28.C7DC7A030000');
      assert.equal(body.enable, true);
      assert.equal(body.name, 'test');
      assert.equal(body.ow.crc, '00');
      assert.equal(body.ow.id, 'C7DC7A0300');
      assert.equal(body.ow.FamilyCode, '28');
      done();
    });
  });
  
  it('[PUT] /device/:device (success)', function(done) {
    var options = {
      uri: apiurl+'/device/'+uuid,
      method: 'PUT',
      json: {
        name: 'sensor#1'
      }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Object' );
      assert.equal( body.uuid, uuid );
      assert.equal(body.name, 'sensor#1');
      done();
    });
  });
});
describe('device/event', function() {
  it('[GET] /device/:device/event (success)', function(done) {
    request({json: true, url: apiurl+'/device/'+uuid+'/event'}, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 1 );
      assert.equal(body[0].level, 'notice');
      assert.equal(body[0].msg, 'Created');
      done();
    });
  });
  
});
describe('device/data', function() {  
  it('[POST] /device/:device/data (success)', function(done) {
    var options = {
      uri: apiurl+'/device/'+uuid+'/data',
      method: 'POST',
      json: {
        values: [{unit: 'C', value: 12}]
      }
    };
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Object' );
      assert.equal( body.device, uuid );
      done();
    });
  });
  
  it('[GET] /device/:device/data (success)', function(done) {
    request({json: true, url: apiurl+'/device/'+uuid+'/data'}, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 1 );
      assert.equal(body[0].device, uuid);
      assert.typeOf(body[0].values, 'Array');
      assert.equal(body[0].values.length, 1);
      assert.equal(body[0].values[0].value, 12);
      done();
    });
  });
}); 


describe('device/rule', function() {  
  it('[GET] /device/:device/rule (success)', function(done) {
    request({json: true, url: apiurl+'/device/'+uuid+'/rule'}, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 0 );
      done();
    });
  });
  it('[POST] /device/:device/rule (success)', function(done) {
    var options = {
      uri: apiurl+'/device/'+uuid+'/rule',
      method: 'POST',
      json: {
        name:  'test',
        conditions: [{
          script: '1==1',
          after: {
            delay: 1
          }
        }],
        actions: [ {action: '001122-33445'} ],
      }
    }
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Object' );
      assert.equal( body.device, uuid );
      assert.isTrue( body.uuid.match(match.uuid).length==1 );
      assert.equal( body.name, 'test');
      assert.equal( body.actions.length, 1);
      assert.equal( body.conditions.length, 1);
      assert.equal( body.conditions[0].script, '1==1');
      assert.equal( body.conditions[0].before.delay, 0);
      assert.equal( body.conditions[0].after.delay, 1);
      done();
    });
    
  });
});

describe('device', function() {  
  it('[DELETE] /device/:device (success)', function(done) {
    var options = {
      uri: apiurl+'/device/'+uuid,
      method: 'DELETE',
      json: {}
    }
    request(options, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[GET] /device', function(done) {
    request.get({json: true, url: apiurl+'/device.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 0 );
      done();
    });
  });
  it('[GET] /device/:device (not found)', function(done) {
    request.get({json: true, url: apiurl+'/device/'+uuid},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 404);
      done();
    });
  });
  it('[GET] /device/:device/rule (not found)', function(done) {
    request.get({json: true, url: apiurl+'/device/'+uuid+'/rule'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  it('[GET] /device/:device/event (dev not found)', function(done) {
    request.get({json: true, url: apiurl+'/device/'+uuid+'/event'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 404);
      done();
    });
  });
  it('[GET] /device/:device/data (not found)', function(done) {
    request.get({json: true, url: apiurl+'/device/'+uuid+'/data'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 0 );
      done();
    });
  });
  it('[GET] /rule (empty)', function(done) {
    request.get({json: true, url: apiurl+'/rule'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      assert.equal( body.length, 0 );
      done();
    });
  });
});

describe('stop', function() {  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --silent --stop --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    });
  });
});  
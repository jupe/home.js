var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request").defaults({jar: true});

var appurl = 'http://localhost:3000';
var apiurl = appurl+'/api/v0';



describe('api#1:init', function() {
  before( function(){
    
  });
  it('server start as daemon', function(done) {
    this.timeout(5000);
    exec('node index --silent --start --pidfile app.pid',function(err,stdout,stderr){
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      setTimeout(done, 2000);
    })
  });
});

describe('api#1:basics', function() {  
  var schedules = [];
  it('[POST] /login (login:fail)', function(done) {
    var options = {
      uri: apiurl+'/login',
      method: 'POST',
      json: {
        "name": "admin",
        "password": "aadmin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      done();
    });
  });
  
  it('[GET] /user.json (success)', function(done) {
    request.get ({json: true, url: apiurl+'/user.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.isTrue(body.length >= 1);
      assert.equal(body[0].name, 'admin');
      done();
    });
  });
  it('[GET] /group.json (success)', function(done) {
    request.get ({json: true, url: apiurl+'/group.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.equal(body.length, 2);/* maybe it's not so important to check so deeply
      var id = body[0].name == 'admin' ? 0:1;
      assert.equal(body[id].name, 'admin');
      assert.equal(body[id].users.length, 1);
      assert.equal(body[id].users[0], 'admin');
      assert.equal(body[(id+1)%2].name, 'default');
      assert.equal(body[(id+1)%2].users.length, 1);
      assert.equal(body[(id+1)%2].users[0], 'admin');*/
      done();
    });
  });
  
  it('[POST] /user   (create-fail)', function(done) {
    var options = {
      uri: apiurl+'/user',
      method: 'POST',
      json: {
        "name": "jupe",
        "email": "jussiva@gmail.com"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      done();
    });
  });
  
  it('[GET] /action.json (success)', function(done) {
    request.get ({json: true, url: apiurl+'/action.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.equal(body.length, 2); //only defaults: owReadAll and owPing
      done();
    });
  });
  
  it('[GET] /schedule.json (success)', function(done) {
    request.get ({json: true, url: apiurl+'/schedule.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      schedules = body;
      assert.equal(body.length, 2); //only defaults: owReadAll and owPing
      
      //assert.equal(body[0].enable, false);
      //assert.equal(body[1].enable, false);
      
      
      done();
    });
  });
  
  it('[GET] /service/cron (success)', function(done) {
    request.get ({json: true, url: apiurl+'/service/cron'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.equal(body.status.enable, false);
      done();
    });
  });
  
  it('[POST] /service/cron/start (fail)', function(done) {
    var options = {
      uri: apiurl+'/service/cron/start',
      method: 'POST'
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      done();
    });
  });
  
  it('[POST] /login (login-success)', function(done) {
    var options = {
      uri: apiurl+'/login',
      method: 'POST',
      json: {
        "name": "admin",
        "password": "admin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[GET] /event (login-success)', function(done) {
    request.get({json: true, url: apiurl+'/event?l=1&s={"created.timestamp":-1}'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'Array');
      assert.equal(body.length, 1);
      assert.equal(body[0].type, 'info');
      done();
    });
  });
  
  it('[POST] /login   (login:already logged in)', function(done) {
    var options = {
      uri: apiurl+'/login',
      method: 'POST',
      json: {
        "name": "admin",
        "password": "admin"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[POST] /service/cron/start', function(done) {
    var options = {
      uri: apiurl+'/service/cron/start',
      method: 'POST'
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[POST] /user (create: success)', function(done) {
    var options = {
      uri: apiurl+'/user',
      method: 'POST',
      json: {
        "name": "juuser",
        "password": "password",
        "email": "jussiva@gmail.com"
      }
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[GET] /service/cron', function(done) {
    request.get({json: true, url: apiurl+'/service/cron'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.equal(body.status.enable, true);
      //assert.equal(body.services.length, 0);
      done();
    });
  });
  
  it('[PUT] /schedule/[owPing].json (success)', function(done) {
    var options = {
      uri: apiurl+'/schedule/'+schedules[0].uuid+'.json',
      method: 'PUT',
      json: {"enable": "true"}
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object'); //only defaults: owReadAll and owPing
      assert.equal(body.enable, true);
      
      done();
    });
  });
  
  it('[GET] /schedule/[owPing].json (success)', function(done) {
    request.get ({json: true, url: apiurl+'/schedule/'+schedules[0].uuid+'.json'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'object'); //only defaults: owReadAll and owPing
      
      assert.equal(body.enable, true);
      
      done();
    });
  });
  
  
  it('[GET] /service/cron/stop', function(done) {
    var options = {
      uri: apiurl+'/service/cron/stop',
      method: 'GET'
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[GET] /logout', function(done) {
    request.get({url: apiurl+'/logout', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[POST] /service/cron/start (denied)', function(done) {
    var options = {
      uri: apiurl+'/service/cron/start',
      method: 'POST',
      json: {}
    };
    request(options,
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 403);
      done();
    });
  });
  
  it('[GET] /device.json (success)', function(done) {
    request.get({url: apiurl+'/device.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[GET] /event.json (success)', function(done) {
    request.get({url: apiurl+'/event.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[GET] /schedule.json', function(done) {
    request.get({url: apiurl+'/schedule.json', json:true}, 
      function(err, res, body){
      
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      done();
    });
  });
  
  it('[GET] /action.json', function(done) {
    request.get(apiurl+'/action.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      
      var id = body[0].name === "owPing" ? 0:1;
      
      assert.equal(body[id].name, "owPing");
      assert.equal(body[id].script, "ow.ping();");
      assert.equal(body[id].type, "script");

      assert.equal(body[(id+1)%2].name, "owReadAll");
      assert.equal(body[(id+1)%2].script, "ow.readAll();");
      assert.equal(body[(id+1)%2].type, "script");
      done();
    });
  });
});

describe('api#1:stop', function() {  
  it('server stop', function(done) {
    this.timeout(5000);
    exec('node index --silent --stop --pidfile app.pid',function(err,stdout,stderr){
      assert.equal(err, null);
      assert.equal(stderr, '');
      setTimeout(done, 4000);
    });
  });
});  
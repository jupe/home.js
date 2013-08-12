var exec=require('child_process').exec
  , assert = require('chai').assert
  , request = require("request");

  var request = request.defaults({jar: true})

describe('init', function() {
  
  it('server start as daemon', function(done) {
    this.timeout(3000);
    exec('node index --silent --start --pidfile app.pid',function(err,stdout,stderr){
      console.log('starting daemon');
      assert.typeOf(err, 'null');
      assert.equal(stderr, '');
      console.log(stdout);
      done();
    })
  });
});

describe('basics', function() {  

  it('[POST] /login (fail)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
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
    request.get ({json: true, url: 'http://localhost:3000/user.json'},
      function(err, res, body){
      assert.equal(res.statusCode, 200);
      assert.equal(err, null);
      assert.equal(body.length, 1);
      assert.equal(body[0].name, 'admin');
      done();
    });
  });
  it('[GET] /group.json (success)', function(done) {
    request.get ({json: true, url: 'http://localhost:3000/group.json'},
      function(err, res, body){
      assert.equal(res.statusCode, 200);
      assert.equal(err, null);
      assert.equal(body.length, 2);
      var id = body[0].name == 'admin' ? 0:1;
      assert.equal(body[id].name, 'admin');
      assert.equal(body[id].users.length, 1);
      assert.equal(body[id].users[0], 'admin');
      assert.equal(body[(id+1)%2].name, 'default');
      assert.equal(body[(id+1)%2].users.length, 1);
      assert.equal(body[(id+1)%2].users[0], 'admin');
      done();
    });
  });
  
  it('[POST] /user   (fail)', function(done) {
    var options = {
      uri: 'http://localhost:3000/user',
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
  
  
  it('[GET] /service/cron (success)', function(done) {
    request.get ({json: true, url: 'http://localhost:3000/service/cron'},
      function(err, res, body){
      assert.equal(res.statusCode, 200);
      assert.equal(err, null);
      assert.equal(body.cron.active, false);
      assert.equal(body.services.length, 0);
      done();
    });
  });
  
  it('[POST] /service/cron/start (fail)', function(done) {
    var options = {
      uri: 'http://localhost:3000/service/cron/start',
      method: 'POST'
    };
    request(options,
      function(err, res, body){
      assert.equal(res.statusCode, 403);
      assert.equal(err, null);
      done();
    });
  });
  
  it('[POST] /login (success)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
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
  
  it('[POST] /user (success)', function(done) {
    var options = {
      uri: 'http://localhost:3000/user',
      method: 'POST',
      json: {
        "name": "jupe",
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
  
  it('[POST] /login   (already logged in)', function(done) {
    var options = {
      uri: 'http://localhost:3000/login',
      method: 'POST',
      json: {
        "username": "admin",
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
      uri: 'http://localhost:3000/service/cron/start',
      method: 'POST'
    };
    request(options,
      function(err, res, body){
      assert.equal(res.statusCode, 200);
      assert.equal(err, null);
      done();
    });
  });
  
  it('[GET] /service/cron/stop', function(done) {
    var options = {
      uri: 'http://localhost:3000/service/cron/stop',
      method: 'GET'
    };
    request(options,
      function(err, res, body){
      assert.equal(res.statusCode, 200);
      assert.equal(err, null);
      done();
    });
  });
  
  it('[GET] /logout', function(done) {
    request.get({url: 'http://localhost:3000/logout', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  
  it('[POST] /service/cron/start (denied)', function(done) {
    var options = {
      uri: 'http://localhost:3000/service/cron/start',
      method: 'POST'
    };
    request(options,
      function(err, res, body){
      assert.equal(res.statusCode, 403);
      assert.equal(err, null);
      done();
    });
  });
  
  it('[GET] /device.json', function(done) {
    request.get({url: 'http://localhost:3000/device.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[GET] /event.json', function(done) {
    request.get({url: 'http://localhost:3000/event.json', json:true}, 
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      done();
    });
  });
  
  it('[GET] /schedule.json', function(done) {
    request.get({url: 'http://localhost:3000/schedule.json', json:true}, 
      function(err, res, body){
      
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      done();
    });
  });
  
  it('[GET] /action.json', function(done) {
    request.get('http://localhost:3000/action.json', 
      function(err, res, body){
      body = JSON.parse(body);
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf(body, 'array');
      assert.equal(body.length, 2);
      
      var id = 0;
      if(body[1].name === "owPing" ) {
        id = 1;
      }
      assert.equal(body[id%2].name, "owPing");
      assert.equal(body[id%2].script, "ow.ping();");
      assert.equal(body[id%2].type, "script");

      assert.equal(body[(id+1)%2].name, "owReadAll");
      assert.equal(body[(id+1)%2].script, "ow.readAll();");
      assert.equal(body[(id+1)%2].type, "script");
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
      done();
    });
  });
});  
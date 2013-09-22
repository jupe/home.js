/*
describe('api#2:device/event', function() {
  
  var uuid;
  it('[GET] /device/:device/event (success)', function(done) {
    request({json: true, url: apiurl+'/device/'+uuid+'/event'}, function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 200);
      assert.typeOf( body, 'Array' );
      //assert.equal( body.length, 1 );
      assert.equal(body[0].level, 'notice');
      assert.equal(body[0].msg, 'Created');
      done();
    });
  });
  it('[GET] /device/:device/event (dev not found)', function(done) {
    request.get({json: true, url: apiurl+'/device/1231456789/event'},
      function(err, res, body){
      assert.equal(err, null);
      assert.equal(res.statusCode, 404);
      done();
    });
  });
});*/
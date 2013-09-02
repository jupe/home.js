var fs = require('fs');
var assert = require('chai').assert;
var TimeSeries = require('../');

describe('TimeSeries:basic', function() {
  
  var db;
  var unixStamp = parseInt(new Date().getTime()/1000);
  before( function(){
    db = new TimeSeries({dir: './hoards'});
    db.remove('123');
  });
  
  it('init', function(done) {
    db = new TimeSeries({dir: './hoards'});
    assert.typeOf( db, 'Object');
    assert.typeOf( db.info, 'Function');
    assert.typeOf( db.create, 'Function');
    assert.typeOf( db.remove, 'Function');
    assert.typeOf( db.update, 'Function');
    assert.typeOf( db.updateMany, 'Function');
    assert.typeOf( db.fetch, 'Function');
    done();
  });
  
  it('create', function(done) {
    db.create( {id: '123', archives: 
              [  
                [60,  60],     // 1min period 60min --> 60 points
              ], period: 0.5
    }, function(err, obj){
      assert.equal(err, null);
      assert.equal(obj.filename, './hoards/123.hoard');
      assert.equal(obj.cfg.id, '123');
      assert.equal(obj.cfg.period, 0.5);
      assert.equal(obj.cfg.archives.length, 1 );
      assert.equal(obj.cfg.archives[0].length, 2 );
      assert.equal(obj.cfg.archives[0][0], 60 );
      assert.equal(obj.cfg.archives[0][1], 60 );
      done();
    });
  });
  
  it('info', function(done) {
    db.info( '123', function(err, obj){
      assert.equal(err, null);
      assert.equal(obj.maxRetention, 3600);
      assert.equal(obj.xFilesFactor, 0.5);
      assert.equal(obj.archives.length, 1);
      done();
    });
  });
  
  it('update', function(done) {
    db.update( '123', unixStamp, 1234, function(err){
      assert.equal(err, null);
      assert.equal(err, null);
      done();
    });
  });
  
  
  it('fetch', function(done) {
    db.fetch({  id: '123', 
                from: ((unixStamp-1000)*1000), 
                to: new Date(), 
                convert: false
              }, function(err, data){
      assert.equal(err, null);
      assert.typeOf(data, 'Object');
      assert.equal(data.timeInfo.interval, 60000);
      assert.equal(data.values.length, 17);
      assert.equal(data.values[15]|data.values[16], 1234);
      done();
    });
  });
  
  
  it('fetch-convert', function(done) {
    db.fetch({  id: '123', 
                from: ((unixStamp-60)*1000), 
                to: new Date(), 
                convert: true
              }, function(err, data){
      assert.equal(err, null);
      //console.log(data);
      assert.typeOf(data, 'Array');
      assert.equal(data.length, 1);
      assert.equal(data[0][1], 1234);
      //console.log( new Date(unixStamp*1000) );
      //console.log( new Date(data[0][0]) );
      assert.isTrue( data[0][0] > (unixStamp*1000-60000) );
      assert.isTrue( data[0][0] < (unixStamp*1000+60000) );
      done();
    });
  });
  
  
  it('remove', function(done) {
    db.remove('123');
    assert.equal( fs.existsSync('./hoards/123.hoard'), false );
    done();
  });
  
});
var fs = require('fs');
var assert = require('chai').assert;
var Query = require('../');

describe('Query:basic', function() {
  
  it('simple#1', function(done) {
    var q = Query({q:'{}'});
    console.log(q);
    assert.equal( JSON.stringify(q.q), "{}"); //find()
    assert.equal( q.t, 'find');                // query type
    assert.equal( q.f, '');                   // select('')
    assert.equal( JSON.stringify(q.s), "{}"); // sort()
    assert.equal( q.sk, 0);                   // skip(0)
    assert.equal( q.l, 1000);                 // limit(0)
    done();
  });
  
  it('simple#2', function(done) {
    var q = Query({q:'{}', l: 5, sk: 20, t: 'count'});
    console.log(q);
    assert.equal( JSON.stringify(q.q), "{}");   //find()
    assert.equal( q.t, 'count');                // !count
    assert.equal( q.f, '');                     // select('')
    assert.equal( JSON.stringify(q.s), "{}");   // sort()
    assert.equal( q.sk, 20);                    // skip(20)
    assert.equal( q.l, 5);                      // limit(5)
    done();
  });
  
  it('simple#3', function(done) {
    var q = Query({q:'{}', l: 2, sk: 2, t: 'distinct'});
    console.log(q);
    assert.equal( JSON.stringify(q.q), "{}"); //find()
    assert.equal( q.t, 'distinct');           // distinct()
    assert.equal( q.f, '');                   // select('')
    assert.equal( JSON.stringify(q.s), "{}"); // sort()
    assert.equal( q.sk, 2);                   // skip(2)
    assert.equal( q.l, 2);                    // limit(2)
    done();
  });
  
});
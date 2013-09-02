var fs = require('fs');
var assert = require('chai').assert;
var Query = require('../');

describe('Query:basic', function() {
  
  it('simple#1', function(done) {
    var q = Query({q:'{}'});
    console.log(q);
    assert.equal( JSON.stringify(q.q), "{}"); //find()
    assert.equal( q.c, false);                // !count
    assert.equal( q.f, '');                   // select('')
    assert.equal( q.fo, false);               // findOne | find
    assert.equal( JSON.stringify(q.s), "{}"); // sort()
    assert.equal( q.sk, 0);                   // skip(0)
    assert.equal( q.l, 1000);                 // limit(0)
    assert.equal( q.p, false);                // populate instead of find
    done();
  });
  
  it('simple#2', function(done) {
    var q = Query({q:'{}', l: 5, sk: 20, c: 'true'});
    console.log(q);
    assert.equal( JSON.stringify(q.q), "{}"); //find()
    assert.equal( q.c, true);                // !count
    assert.equal( q.f, '');                   // select('')
    assert.equal( q.fo, false);               // findOne | find
    assert.equal( JSON.stringify(q.s), "{}"); // sort()
    assert.equal( q.sk, 20);                   // skip(20)
    assert.equal( q.l, 5);                 // limit(5)
    assert.equal( q.p, false);                // populate instead of find
    done();
  });
  
});
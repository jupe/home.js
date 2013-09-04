/**
  MONGOOSE QUERY GENERATOR FROM HTTP URL
  e.g.
  var query = require(mongoose-query);
  query(req.query, mymodel).exec(function(error, data){
  });
  
*/

var dbg = false;

var parseQuery = function(query){
  /**
  [q=<query>][&c=true][&f=<fields>][&fo=true][&s=<order>][&sk=<skip>][&l=<limit>]
  q=<query> - restrict results by the specified JSON query
  t= find|findOne|count|aggregate|distinct|populate..
  f=<set of fields> - specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
  s=<sort order> - specify the order in which to sort each specified field (1- ascending; -1 - descending)
  sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
  l=<limit> - specify the limit for the number of results (default is 1000)
  */
  var qy = {
    q: {},      //  query
    t: 'find',   //  count
    f: '',      // fields
    s: {},      //  sort
    sk: 0,      //  skip
    l: 1000,     //  limit
  }
  
  var toJSON = function(str){
    var json = {}
    try{
      json = JSON.parse(str);
    } catch(e){
      json = {};
    } 
    return json;
  }
  
  for(var key in query){
    switch(key) {
      case('q'): qy.q = toJSON(query[key]); break;
      case('t'): qy.t = query[key]; break;
      case('f'): qy.f = query[key]; break;
      case('s'): qy.s = toJSON(query[key]); break;
      case('sk'): qy.sk = parseInt(query[key]); break;
      case('l'): qy.l = parseInt(query[key]); break;
      default: 
        qy.q[key] = query[key];
        break;
    }
  }
  return qy;
}
var doQuery = function(query, model)
{
  var query = parseQuery(query);
  if(!model)return query;
  if(dbg)console.log(query);
  var find = model;
  
  switch( query.t ){
    case('find'): find = find.select(query.f); break;
    case('findOne'): find = find.findOne(query.q); break;
    case('count'): find = find.count(query.q); return find;
    case('distinct'): 
      find = find.distinct(query.f, query.q);
      return find;
    case('aggregate'): 
      find = find.aggregate(query.q);
    case('populate'): 
      find = find.populate(query.q);
  }
  if( query.t != 'aggregate' ){
    if( query.f) find = find.select(query.f);
  }
  
  if( query.l ) find = find.limit(query.l);
  if( query.sk ) find = find.skip(query.sk);
  if( query.s ) find = find.sort(query.s);
  
  return find;
}

module.exports = doQuery;
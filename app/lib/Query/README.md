Query
==========

http Query library for mongoose

# Usage:

```
var Query = require('query');
Query( req.query, mongooseModel,  function(err, docs){
});
```

# doc

```
[q=<query>][&t=<type>][&f=<fields>][&s=<order>][&sk=<skip>][&l=<limit>][&p=<populate>]
q=<query> - restrict results by the specified JSON query
t=<type> - find|findOne|count|aggregate|distinct..
f=<set of fields> - specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
s=<sort order> - specify the order in which to sort each specified field (1- ascending; -1 - descending)
sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
l=<limit> - specify the limit for the number of results (default is 1000)
p=<populate> - specify the fields for populate
```





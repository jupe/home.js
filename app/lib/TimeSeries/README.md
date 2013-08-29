TimeSeries
==========

TimeSeries db library, which used hoard database background.

Api:
TimeSeries(cfg)
 cfg.dir: Directory for hoard files
create(cfg, callback)
info(id, callback)
update(id, timestamp, value, callback)
updateMany({id:x, values: [[]], callback)
remove(id)


Usage:

```
var db = new TimeSeries({dir: './hoards'});

db.create( {id: '123', period: 0.5, archives: []}, function(err, obj){
});

db.update( '123', new Date(), 12, function(err){
});
```



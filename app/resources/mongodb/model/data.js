var mongoose = require('mongoose');
var schema = require('./../schema/data');
var model = mongoose.model('data', schema);

function push(timestamp, value, cb)
{
  console.log('push');
  model.findOne( {'metadata.date': DataSchema.toDate(timestamp)}, function(error, doc){
    if( error) {
      console.log(error);
      cb(error);
    } else if( doc ) {
      var json = doc.toObject();
      console.log('update old');
      var sum=0;
      for(var min in json.minute){
        console.log( json.minute[min] );
        for(var sec in json.minute[min]){
          sum += json.minute[min][sec];
        }
      }
      console.log(sum);
      doc.hourly[ timestamp.getHours() ] = sum/23/60;
      doc.minute[ timestamp.getHours() ][ timestamp.getMinutes() ] = value;
      doc.updatedAt.date = new Date();
      doc.save(cb);
    } else {
      console.log('Create new');
      var doc = new model({ 'metadata.date': timestamp});
      sum = value;
      doc.hourly[ timestamp.getHours() ][ timestamp.getMinutes() ] = sum/23/60;
      doc.minute[ timestamp.getHours() ][ timestamp.getMinutes() ] = value;
      doc.updatedAt.date = new Date();
      doc.save(cb);
    }
  });
  
  //console.log( doc.hourly );
  model.find({}, function(err,docs){
    if(err) console.log(err);
    if(docs){
      console.log(docs.length);
    }
  });
}


module.exports = model;
module.exports.push = push;
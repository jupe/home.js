var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
/*
  Contains individual data
  e.g. { values: [ unit: 'C', value: 12] }
*/

var DeviceData = new Schema({
    uuid : {type: String}, 
    device :  { type: String, required: true },
    timestamp: {type: Date, default: Date.now},
    values: [{
        unit: { type: String, enum: ['W', 'kWh', 'C', 'V','A'] },
        value: {type: Number, required: true}
    }],
}).pre('save', function (next) {
  
  if( this.values.length == 0 )
  {
    next(new Error("There is no any values!"));
    return;
  }
  if( this.isNew ){
    this.uuid = uuid.v1();
  }
  next(); 
});

module.exports = DeviceData;
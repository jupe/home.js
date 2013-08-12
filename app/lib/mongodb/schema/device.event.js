var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var DeviceEvent = new Schema({
    uuid : {type: String}, 
    device :  { type: String, required: true },
    type: {type: String, enum: ['measure', 'alert'], required: true, default: 'measure'},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    values: [{
        unit: { type: String, enum: ['W', 'kWh', 'C', 'V','A'], required: true },
        value: {type: Number, required: true}
    }],
}).pre('save', function (next) {
  
  if( this.type == 'measure' && this.values.length == 0 )
  {
    err = new Error("There is no any values!");
    next(err);
    return;
  }
  if( this.isNew ){
    this.uuid = uuid.v1();
  }
  next(); 
});

module.exports = DeviceEvent;
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
/*
  Contains alerts, admin messages and so on.
  e.g. { type: alert, meta: {msg: 'Temperature is too high'}}
*/
var DeviceEvent = new Schema({
    uuid : {type: String}, 
    device :  { type: String, required: true },
    level: {type: String, enum: ['panic', 'alert', 'crit', 'err','warn','notice','info','debug'], required: true, default: 'notice'},
    timestamp: {type: Date, default: Date.now},
    flag: { type: String, enum: ['ack', 'nak', ''], default: '' },
    msg: {type: String, required: true}
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
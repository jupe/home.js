var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;


var Sensor = new Schema({
  uuid: {type: String, index: true, unique: true},
  name: {type: String},
  device: {type: Schema.Types.ObjectId, ref: 'device'},
  protocol  :  { type: String, enum: ['ow', 'zwave', 'vbus', 'unknown'], default: 'unknown' },
  unit: {type: String, default: ''},
  ow: {
    FamilyCode: {type: String, max_length: 2, min_length: 2},
    id: {type: String, max_length: 10, min_length: 10},
    crc: {type: String, max_length: 2, min_length: 2},
    lastValue: {type: Number}
  },
  vbus: {
    //what we need here?
  },
  zwave: {
  },
  funcs: [
    // functions are executed every time when [POST] /device/:device/sensor/:sensor  {value: ..} is received
    { 
      comparision: {type: String},  // e.g. "return (value > 28 )"
      action: {type: String}        // action uuid what happens if comparision is true
    }
  ]
}).pre('save', function (next) 
{
  if( this.isNew ){
    // New
    this.uuid = uuid.v1();
  }
  next();
});
Sensor.methods.newMeasurementResult = function(timestamp, value, callback){
  var self = this;
  if( value instanceof Array ) {
    value.forEach( function(value){
      self.newMeasurementResult(timestamp, value, callback);
    });
  } else {
     db.data.findOrCreate(
      {'metadata.sensor': this.uuid},
      { metadata: {
          date: Math.round(timestamp/60000/60/24)*60000*60*24,
          device: this.device,
          sensor: this.uuid,
        }
      }, function(error, doc){
        if(error){
          console.log('data.findOrCreate-error');
          winston.error(error);
        } else if(doc){
          doc.push(timestamp, value);
        }
      }
    );
  }
}

var Device = new Schema({
  uuid : {type: String, index: true, unique: true}, 
  name  :  { type: String, required: true },
  id    :  { type: String, index: true },
  enable: {type: Boolean, default: true},
  type: { type: String, enum: ['switch', 'sensor', 'meter', 'thermostat', 'camera']},
  sensors: [ Sensor ], //list of sensors related to this device
  created :  {
      timestamp: { type: Date, default: Date.now },
      user: {type: String}
  },
  modified: {
    timestamp: { type: Date, default: Date.now },
    user: {type: String}
  },
  location: {
    //device location
    room: {type: String},
    city: {type: String},
    country: {type: String},
    geo: {type: [Number], index: '2d'},
    map: {type: [Number], index: '2d', index: true},
  }
}).pre('save', function (next) 
{
  if( this.isNew ){
    // New
    this.uuid = uuid.v1();
    //loop sensors if any
    if( this.sensors ) {
      console.log(this.sensors);
      for(var i=0;i<this.sensors.length;i++) {
        this.sensors[i].device = this.uuid;
        if( this.sensors[i].protocol == "ow" ) {
          var parts = this.sensors[i].name.match(/^(\d{2}).([A-F0-9]{10})([A-F0-9]{2})/); //28.C7DC7A030000
          if( parts.length != 4 ){
            console.log("ow id length (%i)!= 15 !", this.sensors[i].name.length);
            next( new Error("invalid id") );
            return;
          } else {
            this.sensors[i].ow = {
              FamilyCode: parts[1],
              id: parts[2],
              crc: parts[3]
            }
          }
        }
      }
    }
  }
  /*if( this.created ) {
    if( this.created.user ) {
      this.modified.user = this.created.user;
    }
  }*/
  this.modified.timestamp = new Date();
  next();
});
Device.methods.findSensor = function(sensor, cb){
  if(this.sensors){
    for(i=0;this.sensors.length; i++){
      if( this.sensors[i].uuid = sensor ){
        if(cb)cb(null, this.sensors[i]);
        return this.sensors[i];
      }
    }
  } else {
    var error = {error: 'not found'};
    cb(error);
    return error;
  }
}
/*
Device.static('newMeasurementResult', function (sensor, timestamp, value, callback) {
  if( value instanceof Array ) {
  } else {
    //this.findOne({ uuid: device }, callback);
    //console.log(value);
    db.device.findOne({'sensors.uuid': sensor}, function(error, dev){
      
      db.data.findOrCreate(
      {'metadata.sensor': dev._id}, 
      {
        metadata: {
          sensor: dev._id,
          device: dev._id,
          date: new Date(timestamp)
        }
      }, function(error, doc){
        if(error)winston.error(error)
        else if(doc) doc.push(timestamp, value);
      });
    });
    db['device.data'].store({
      device :  device,
      timestamp: timestamp,
      values: [{value: value}]
    }, callback);
  }
});*/
module.exports = Device;
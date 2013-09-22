var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Device = new Schema({
  uuid : {type: String, index: true, unique: true}, 
  name  :  { type: String, required: true },
  id    :  { type: String, index: true },
  enable: {type: Boolean, default: true},
  ow: {
    FamilyCode: {type: String, max_length: 2},
    id: {type: String},
    crc: {type: String},
    lastValue: {type: Number},
  },
  data: [
    {
      name: {type: String}, //data name, e.g. temperature
      url: {type: String}, //rest api
      type: {type: String, enum:['timeseries'] }
    }
  ],
  funcs: [  
    // functions are executed every time when [POST] /device/:device/data  {value: ..} is received
    { 
      comparision: {type: String},  // e.g. "return (value > 28 )"
      action: {type: String}        // action uuid what happens if comparision is true
    }
  ],/*
  hoard: {
      enable: {type: Boolean },
      file: {type: String },
      archives: {type: Object},
      period: {type: Number}
  },*/
  protocol  :  { type: String, enum: ['ow', 'zwave', 'vbus', 'service'], index: true, required: true }, 
  type: { type: String, enum: ['switch', 'sensor', 'meter', 'thermostat', 'camera']},
  created :  {
      timestamp: { type: Date, default: Date.now },
      user: {type: String}
  },
  modified: {
    timestamp: { type: Date, default: Date.now },
    user: {type: String}
  },
  location: {
    room: {type: String},
    geo: {type: [Number], index: '2d'},
    map: {type: [Number], index: '2d', index: true},
  }
}).pre('save', function (next) 
{
  if( this.isNew ){
    // New
    this.uuid = uuid.v1();
    if( this.protocol == "ow" )
    {
      var parts = this.id.match(/^(\d{2}).([A-F,0-9]{12})/); //28.C7DC7A030000
      if( parts.length != 3 ){
        console.log("ow id lenght (%i)!= 15 !", this.id.length);
        next( new Error("invalid id") );
        return;
      } else {
        this.ow.FamilyCode = this.id.substr(0,2);
        this.ow.id = this.id.substr(3,10);
        this.ow.crc = this.id.substr(11,2);
        if( !this.name){
            this.name = this.id;
        }
      }
    }
  }
  
  if( this.created ) {
    if( this.created.user ) {
      this.modified.user = this.created.user;
      this.modified.timestamp = new Date();
    }
  }
  
  next();
});

Device.static('newMeasurementResult', function (device, timestamp, value, callback) {
  if( value instanceof Array ) {
  } else {
    //this.findOne({ uuid: device }, callback);
    //console.log(value);
    db.device.findOne({uuid: device}, function(error, dev){
      db.data.findOrCreate({'metadata.device': dev._id}, 
      {
        metadata: {
          device: dev._id,
          date: new Date(timestamp)
        }
      }, function(error, doc){
        if(error)winston.error(error)
        else if(doc) doc.push(timestamp, value);
      });
    });
    /*
    db['device.data'].store({
      device :  device,
      timestamp: timestamp,
      values: [{value: value}]
    }, callback);*/
  }
});

module.exports = Device;
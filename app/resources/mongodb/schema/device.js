var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Device = new Schema({
    uuid : {type: String, index: true}, 
    name  :  { type: String },
    id    :  { type: String, index: true, unique: true },
    enable: {type: Boolean, default: true},
    ow: {
        FamilyCode: {type: String, max_length: 2},
        id: {type: String},
        crc: {type: String},
        lastValue: {type: Number},
    },
    hoard: {
        enable: {type: Boolean },
        file: {type: String },
        archives: {type: Object},
        period: {type: Number}
    },
    protocol  :  { type: String, enum: ['ow', 'zwave'], index: true, required: true }, 
    type: { type: String, enum: ['switch', 'sensor', 'meter', 'thermostat', 'camera']},
    created :  {
        timestamp: { type: Date, default: Date.now },
        user: {type: String}
    },
    lastAction: { type: Date, default: Date.now },
    location: {
        room: {type: String},
        geo: {type: [Number], index: '2d'},
        map: {type: [Number], index: '2d', index: true},
    }
}).pre('save', function (next) 
{
  if( this.isNew )
    this.uuid = uuid.v1();
  
  if( this.protocol == "ow" )
  {
    if( this.id && this.id.length!= 15 ){
        //28.C7DC7A030000
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
  next();
 
});

module.exports = Device;
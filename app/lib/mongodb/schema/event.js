var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Event = new Schema({
    uuid : {type: String},
    type  :  { type: String, default: 'general', enum: ['general', 'fatal', 'error', 'warn', 'info'] },
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    source: {
        component: {type: String, enum: ['device', 'rule', 'action', 'schedule', 'group', 'user', 'service'] },
        uuid: { type: String },
        name: { type: String }
    }, 
    msg: {type: String, required: true},
    details: {type: String}
}).pre('save', function (next) {
   if( this.isNew )
    this.uuid = uuid.v1();
   next();
});

module.exports = Event;
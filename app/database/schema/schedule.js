var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Schedule = new Schema({ 
    uuid : {type: String,  unique: true, index: true},
    enable: {type: Boolean, default: false},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    lastTriggered: {type: Date},
    name  :  { type: String, unique: true },
    description:  { type: String },
    cron: {type: String, default: '0 0 * * * *'}, //for cron-parser
    preAction: {type: String},
    actions: [ {type: String} ],
    postAction: {type: String},
}).pre('save', function (next) {
   if( this.isNew && this.uuid!='0' ) 
    this.uuid = uuid.v1();
   next();
});
Schedule.path('cron').validate(function (value, respond) {
  var len = value.split(' ').length;
  respond( len == 6 || len == 5 ); //simple validation for cron
}, 'Invalid cron format. Valid format is for e.g. "*/22 * * * * *" {second (optional), minute, hour, dayOfMonth, month, dayOfWeek}');

module.exports = Schedule;
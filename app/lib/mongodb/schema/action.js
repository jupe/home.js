var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Action = new Schema({
    uuid : {type: String, unique: true, index: true},
    enable: {type: Boolean, default: true},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    lastAction: {type: Date, default: Date.now},
    type: {type: String, enum: ['script'], default: 'script'},
    name:  { type: String },
    description:  { type: String },
    script: {type: String }, //
}).pre('save', function (next) {
   if( this.isNew && this.uuid!='0' )
    this.uuid = uuid.v1();
   next();
});

module.exports = Action;
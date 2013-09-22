var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = mongoose.Schema.Types.Mixed;
    
var ServiceSchema = new Schema({
    name: {type: String, required: true, index: { unique: true }},
    enable: {type: Boolean, default: false },
    configurations: { type: Mixed } //allow any kind of options related to service
}).pre('save', function(next){
    
  if( this.isNew ){
    //console.log('New user..');
  }
 
  next();
});

module.exports = ServiceSchema;
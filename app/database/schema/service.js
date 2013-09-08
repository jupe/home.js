var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
    
var ServiceSchema = new Schema({
    name: {type: String, required: true, index: { unique: true }},
    enable: {type: Boolean, default: false }
}).pre('save', function(next){
    
  if( this.isNew ){
    //console.log('New user..');
  }
 
  next();
});

module.exports = ServiceSchema;
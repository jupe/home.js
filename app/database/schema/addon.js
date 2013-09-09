var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
    
var AddonSchema = new Schema({
    name: {type: String, required: true, index: { unique: true }},
    enable: {type: Boolean, default: false }
}).pre('save', function(next){
    
  if( this.isNew ){
    winston.info('New addon '+this.name);
  }
  next();
});

module.exports = AddonSchema;
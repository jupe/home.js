/**
 * Gets native or Mongoose SchemaType name from obj
 *
 * @param {Object} obj
 * @returns {String}
 * @api private
 */
var getType = function(obj){
    if (typeof obj !== 'function') return obj;
    var text = obj.toString();
    text = text.match(/function (.*)\(/);
    if( text.length==2) return text[1];
    return false;
}
var toJsonType = function(obj){
  switch(getType(obj)) {
    case 'String': return 'string';
    case 'Date': return 'date';
    case 'Number': return 'number';
    case 'Boolean': return 'boolean';
    case 'Buffer': return 'buffer';
    case 'ObjectId': return 'objectid';
    case 'Mixed': return 'mixed';
    default: 
      break;
  }
   switch(getType(obj.type)) {
    case 'String': return 'string';
    case 'Date': return 'date';
    case 'Number': return 'number';
    case 'Boolean': return 'boolean';
    case 'Buffer': return 'buffer';
    case 'ObjectId': return 'objectid';
    case 'Mixed': return 'mixed';
    default: 
      return false;
  }
}
var isVariable = function(obj){
  if( !obj ){ 
    return false;
  } else if( toJsonType(obj) ){
    return true;
  } else return false;
}
function SchemaToJSON(obj, out, array) {
  if(!out) out = new Object();
  try {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if( property === 'id' ||
          property === '__v' ||
          property === '_id' ) continue;
      if(!isVariable(obj[property]) &&
        typeof(obj[property]) === "object" ){
        
        if( !Array.isArray(obj[property]) ) {
          console.log('parse object: '+property +' - '+typeof(obj[property]));
          out[property] = new Object();
          out[property].name = property;
          out[property].type = 'array';
          out[property].items = new Object();
          SchemaToJSON(obj[property], out[property].items);
        } else {
          out[property] = new Object();
          out[property].name = property;
          out[property].type = 'array';
          out[property].items = new Object();
          SchemaToJSON(obj[property], out[property].items, true);
        }
      } else {
        console.log('parse variable: '+property);
        if( array ) {
          out.type = toJsonType(obj[property]);
          if(obj.enum ) {
             out.enum = obj[property].enum.slice(0);
          }
          if( obj[property].min )
            out.minimum = obj[property].min;
          if( obj[property].max )
            out.maximum = obj[property].max;
          if( obj[property].required )
            out.required = obj[property].required;
          if( obj[property].unique )
            out.uniqueItems = obj[property].unique;

          out.title = property;

        } else {
          out[property] = new Object();
          out[property].type = toJsonType(obj[property]);
          if(obj[property].enum ) {
             out[property].enum = obj[property].enum.slice(0);
          }
          if( obj[property].min )
            out[property].minimum = obj[property].min;
          if( obj[property].max )
            out[property].maximum = obj[property].max;
          if( obj[property].required )
            out[property].required = obj[property].required;
          if( obj[property].unique )
            out[property].uniqueItems = obj[property].unique;

          out[property].title = property;
        }
      }
    }
  }
  } catch(e){
    console.log(e);
  }
  return out;
  //return {in: obj, out:out};
}

module.exports = SchemaToJSON;
var TemplateService = function() {
  var self = this;
  var state = false;
  
  /* Interface functions */
  var start = function(){
    state = true;  
    return status();
  }
  var stop = function(){
    state = false;
    return status();
  }
  var status = function(){
    return state;
  }

  /* MODULE API */
  return {
    start: start,
    stop: stop,
    status: status
  }
  
}
// export the class
module.exports = TemplateService;
module.exports.disable = true;
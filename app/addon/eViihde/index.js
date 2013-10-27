var request = require('request');
var qs = require('querystring');
var _ = require('underscore');
   
var eViihdeAddon = function(app) {
  
  function Init(app){
      app.get('/api/v0/entertainment/tv/now', now);
      app.get('/api/v0/addon/eviihde/tv/now', now);
  }
  
  function now(req, res){
    var params = _.extend(true, {}, req.query);
    console.log(qs.stringify(params));
    request.get({ 
      json: true, 
      url: 'http://api.elisaviihde.fi/etvrecorder/ajaxprograminfo.sl?'+qs.stringify(params),
      }, function(error, response, body) {
      res.json(body);
    });
  }
  
  Init(app);
  
  return this;
}

module.exports = eViihdeAddon;
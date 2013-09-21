/*global Backbone */
(function () {
	'use strict';
  
  var app = app || {Routers: {}, Collections: {}, Models: {}, Views: {}};
  
  app.Models.Schedule = Backbone.Model.extend({
    
    idAttribute: "uuid",
    urlRoot: "/schedule",
    url: function(){
      var base = this.urlRoot || (this.collection && this.collection.url) || "/";
      if (this.isNew()) return base;
     return base + "/" + encodeURIComponent(this.id)+'.json';
    },
    defaults: {
        name: '',
        cron: '* * * * * *'
    },
    
    initialize: function() {  },
    
    start: function() {
    },
    stop: function() {
    },
    
    validate: function(attrs, options) {
      return attr.name!='';
    }
  });
  
})();
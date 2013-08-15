define([
  'jquery',
  'underscore',
  'backbone',
  'models/event/EventModel'
], function($, _, Backbone, EventModel){

  var EventCollection = Backbone.Collection.extend({
    model: EventModel,
    url: "/event.json",
    //initialize: function(){}

  });
 
  return EventCollection;
});

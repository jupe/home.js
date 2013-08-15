define([
  'jquery',
  'underscore',
  'backbone',
  'models/event/EventModel'
], function($, _, Backbone, DeviceModel){

  var EventCollection = Backbone.Collection.extend({
    model: DeviceModel,
    url: "/event.json",
    //initialize: function(){}

  });
 
  return EventCollection;
});

define([
  'jquery',
  'underscore',
  'backbone',
  'models/event/EventModel',
  'slickgrid.core',
  'slickgrid.grid',
  'slickgrid.pager',
  'slickback'
], function($, _, Backbone, EventModel){

  var EventCollection = Slickback.PaginatedCollection.extend({
    model: EventModel,
    url: "/api/v0/event",
    //initialize: function(){}

  });
 
  return EventCollection;
});

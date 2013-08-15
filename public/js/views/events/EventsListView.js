// Filename: views/events/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/event/EventModel',
  'collections/events/EventsCollection',
  'text!templates/events/eventsListTemplate.html'

], function($, _, Backbone, EventModel, EventsCollection, eventsListTemplate){
  var EventListView = Backbone.View.extend({
    el: $("#event-list"),

    render: function(){
      console.log('render eventsListView');
      var data = {
        events: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( eventsListTemplate, data );
      $("#event-list").html( compiledTemplate ); 
    }
  });
  return EventListView;
});

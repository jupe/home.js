define([
  'jquery',
  'underscore',
  'backbone',
  'models/event/EventModel',
  'collections/events/EventsCollection',
  'views/events/EventsGridView',
  'text!templates/events/eventTemplate.html'
], function($, _, Backbone, EventModel, EventsCollection, EventsGridView, eventTemplate){

  var EventsView = Backbone.View.extend({
    el: "#page",
    initialize: function(){
      console.log('Initialize eventsView');
      this.eventsCollection = new EventsCollection;
    },
    render: function(){
      console.log('render eventsView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(eventTemplate);
      
      var self = this;
      this.eventsCollection.fetch({
        success: function() {
            var eventsGridView = new EventsGridView({ 
              pager: $('#event-pager'),
              collection: self.eventsCollection
            }); 
            eventsGridView.render();
        }
      });

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return EventsView;
});

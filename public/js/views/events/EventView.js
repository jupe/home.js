define([
  'jquery',
  'underscore',
  'backbone',
  //'views/sidebar/SidebarView',
  'models/event/EventModel',
  'collections/events/EventsCollection',
  'views/events/EventsListView',
  'text!templates/events/eventTemplate.html'
], function($, _, Backbone, /*SidebarView, */EventModel, EventsCollection, EventsListView, eventTemplate){

  var EventsView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      
    },
    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(eventTemplate);
      
      console.log('Create eventsListView');
      this.eventsCollection = new EventsCollection;
      var self = this;
      this.eventsCollection.fetch({
        success: function() {
            var eventsListView = new EventsListView({ collection: self.eventsCollection}); 
            
            console.log('Rendering it');
            eventsListView.render();
        }
      });      

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return EventsView;
});

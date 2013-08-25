// Filename: views/events/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/event/EventModel',
  'collections/events/EventsCollection',
  'text!templates/events/eventsGridTemplate.html',
  'slickgrid.core',
  'slickgrid.grid',
  'slickgrid.pager',
  'slickback'
], function($, _, Backbone, EventModel, EventsCollection, eventsGridTemplate){
  var EventListView = Backbone.View.extend({
    el: $("#event-list"),
    initialize: function(initializationOpts){
      
      this.eventColumns = [
        /*{
          id:       'event_uuid',
          name:     'Uuid',
          field:    'uuid',
          width:    50,
        },
        {
          id:       'event_stamp',
          name:     'Date',
          field:    'created.timestamp',
          width:    150,
        },*/
        {
          id:       'event_msg',
          name:     'Msg',
          field:    'msg',
          width:    250,
        },
      ];
      this.pager  = initializationOpts.pager;
      this.gridOptions = _.extend({},{
        editable:         false,
        formatterFactory: Slickback.BackboneModelFormatterFactory
      }, initializationOpts.grid);
    },

    render: function(){
      console.log('render eventListView');

      var compiledTemplate = _.template( eventsGridTemplate, {_: _} );
      $("#event-list").html( compiledTemplate );
      
      var grid = new Slick.Grid("#event-grid", this.collection, this.eventColumns, this.gridOptions);
      var pager = new Slick.Controls.Pager(this.collection,grid,this.pager);
      
      this.collection.onRowCountChanged.subscribe(function() {
        grid.updateRowCount();
        grid.render();
      }); 

      this.collection.onRowsChanged.subscribe(function() {
        grid.invalidateAllRows();
        grid.render();
      });
    }
  });
  return EventListView;
});

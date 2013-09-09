// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/automation/schedule/ScheduleModel',
  'collections/automation/schedule/ScheduleCollection',
  'text!templates/automation/schedule/schedulesListTemplate.html'

], function($, _, Backbone, ScheduleModel, ScheduleCollection, schedulesListTemplate){
  var ScheduleListView = Backbone.View.extend({
    el: $("#schedule-list"),

    render: function(){
      console.log('render scheduleListView');
      var data = {
        devices: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( schedulesListTemplate, data );
      $("#schedule-list").html( compiledTemplate ); 
    }
  });
  return ScheduleListView;
});

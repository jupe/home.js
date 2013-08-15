// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/automation/action/ActionModel',
  'collections/automation/action/ActionCollection',
  'text!templates/automation/action/actionListTemplate.html'

], function($, _, Backbone, ActionModel, ActionCollection, actionsListTemplate){
  var ActionListView = Backbone.View.extend({
    el: $("#action-list"),

    render: function(){
      console.log('render actionListView');
      var data = {
        devices: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( actionsListTemplate, data );
      $("#action-list").html( compiledTemplate ); 
    }
  });
  return ActionListView;
});

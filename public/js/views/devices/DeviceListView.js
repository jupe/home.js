// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/device/DeviceModel',
  'collections/devices/DevicesCollection',
  'text!templates/devices/devicesListTemplate.html'

], function($, _, Backbone, DeviceModel, DevicesCollection, devicesListTemplate){
  var DeviceListView = Backbone.View.extend({
    el: $("#device-list"),

    render: function(){
      
      var data = {
        devices: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( devicesListTemplate, data );
      $("#device-list").html( compiledTemplate ); 
    }
  });
  return DeviceListView;
});

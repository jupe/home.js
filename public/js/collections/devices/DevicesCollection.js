define([
  'jquery',
  'underscore',
  'backbone',
  'models/device/DeviceModel'
], function($, _, Backbone, DeviceModel){

  var DeviceCollection = Backbone.Collection.extend({
    model: DeviceModel,
    url: "/device.json",
  });
 
  return DeviceCollection;
});

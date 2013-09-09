define([
  'jquery',
  'underscore',
  'backbone',
  'models/device/DeviceModel',
  'slickgrid.core',
  'slickgrid.grid',
  'slickgrid.pager',
  'slickback',
], function($, _, Backbone, DeviceModel){

  var DeviceCollection = Slickback.PaginatedCollection.extend({
    model: DeviceModel,
    url: "/api/v0/device",
  });
 
  return DeviceCollection;
});

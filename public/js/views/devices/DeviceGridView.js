// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  'slickgrid.core',
  'slickgrid.grid',
  'slickgrid.pager',
  'slickback',
  // Pull in the Collection module from above,
  'models/device/DeviceModel',
  'collections/devices/DevicesCollection',
  'text!templates/devices/devicesGridTemplate.html'
], function($, _, Backbone, sc,sg,sp,sb, DeviceModel, DevicesCollection, devicesGridTemplate){
  var DeviceListView = Backbone.View.extend({
    el: $("#device-list"),
    
    initialize: function(initializationOpts){
      
      this.deviceColumns = [
        {
          id:       'device_id',
          name:     'Device',
          field:    'uuid',
          sortable: true,
          width:    120
        },
        {
          id:       'device_name',
          name:     'Name',
          field:    'name',
          width:    150,
          editable: true,
          editor:   Slickback.TextCellEditor
        }
      ];
    
      this.pager  = initializationOpts.pager;
      this.gridOptions = _.extend({},{
        editable:         true,
        formatterFactory: Slickback.BackboneModelFormatterFactory
      }, initializationOpts.grid);

      

    },

    render: function(){
      console.log('render deviceListView');

      var compiledTemplate = _.template( devicesGridTemplate, {_: _} );
      $("#device-list").html( compiledTemplate );
      
      var collection = this.collection;
      
      var grid = new Slick.Grid("#device-grid", collection, this.deviceColumns, this.gridOptions);
      //var pager = new Slick.Controls.Pager(collection,grid,this.pager);
    }
  });
  return DeviceListView;
});

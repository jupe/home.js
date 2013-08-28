// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/device/DeviceModel',
  'collections/devices/DevicesCollection',
  'text!templates/devices/devicesGridTemplate.html',
  'slickgrid.core',
  'slickgrid.grid',
  'slickgrid.pager',
  'slickback'
], function($, _, Backbone, DeviceModel, DevicesCollection, devicesGridTemplate){
  var DeviceListView = Backbone.View.extend({
    el: "#device-list",
    
    initialize: function(initializationOpts){
      
      this.deviceColumns = [
        {
          id:       'device_enable',
          name:     'Enable',
          field:    'enable',
          width:    50,
        },
        {
          id:       'device_id',
          name:     'Device',
          field:    'uuid',
          sortable: true,
          width:    250
        },
        {
          id:       'device_name',
          name:     'Name',
          field:    'name',
          width:    150,
          editable: true,
          editor:   Slickback.TextCellEditor
        },
        {
          id:       'device_type',
          name:     'Type',
          field:    'type',
          width:    150,
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
      
      var grid = new Slick.Grid("#device-grid", this.collection, this.deviceColumns, this.gridOptions);
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
  return DeviceListView;
});

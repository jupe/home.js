define([
  'jquery',
  'underscore',
  'backbone',
  //'views/sidebar/SidebarView',
  'models/device/DeviceModel',
  'collections/devices/DevicesCollection',
  'views/devices/DeviceListView',
  'text!templates/devices/devicesTemplate.html'
], function($, _, Backbone, /*SidebarView, */DeviceModel, DevicesCollection, DevicesListView, devicesTemplate){

  var DevicesView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      
    },
    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(devicesTemplate);
      
      console.log('Create deviceListView');
      this.devicesCollection = new DevicesCollection;
      var self = this;
      this.devicesCollection.fetch({
        success: function() {
            var devicesListView = new DevicesListView({ collection: self.devicesCollection}); 
            
            console.log('Rendering it');
            devicesListView.render();
        }
      });      

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return DevicesView;
});

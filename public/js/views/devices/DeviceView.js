define([
  'jquery',
  'underscore',
  'backbone',
  //'views/sidebar/SidebarView',
  'models/device/DeviceModel',
  'collections/devices/DevicesCollection',
  'views/devices/DeviceGridView',
  'text!templates/devices/devicesTemplate.html'
], function($, _, Backbone, /*SidebarView, */DeviceModel, DevicesCollection, DevicesGridView, devicesTemplate){

  var DeviceView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      console.log('Initialize deviceView');
    },
    render: function(){
      console.log('render deviceView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(devicesTemplate);
      
      
      this.devicesCollection = new DevicesCollection;
      var self = this;
      this.devicesCollection.fetch({
        success: function() {
            var devicesGridView = new DevicesGridView({ 
              pager: $('#device-pager'),
              collection: self.devicesCollection
            }); 
            devicesGridView.render();
        }
      });      

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return DeviceView;
});

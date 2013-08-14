define([
  'jquery',
  'underscore',
  'backbone',
  'views/sidebar/SidebarInfoView',
  'text!templates/home/infoTemplate.html'
], function($, _, Backbone, SidebarView, infoTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    render: function(){
      
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(infoTemplate);

      var sidebarView = new SidebarView();
      sidebarView.render();
 
    }

  });

  return HomeView;
  
});

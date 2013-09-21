define([
  'jquery',
  'underscore',
  'backbone',
  'views/sidebar/SidebarAdminView',
  'text!templates/home/adminTemplate.html'
], function($, _, Backbone, SidebarView, adminTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    render: function(){
      console.log('render adminView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(adminTemplate);

      var sidebarView = new SidebarView();
      sidebarView.render();
 
    }

  });

  return HomeView;
  
});

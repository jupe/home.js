define([
  'jquery',
  'underscore',
  'backbone',
  'views/sidebar/SidebarView',
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'views/users/UsersListView',
  'text!templates/users/usersTemplate.html'
], function($, _, Backbone, SidebarView, UserModel, UsersCollection, UsersListView, usersTemplate){

  var ProjectsView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      this.usersCollection = new UsersCollection;  
    },
    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(usersTemplate);
      
      
      var usersListView = new UsersListView({ collection: this.usersCollection}); 
      
      usersListView.render(); 

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return ProjectsView;
});

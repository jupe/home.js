define([
  'jquery',
  'underscore',
  'backbone',
  //'views/sidebar/SidebarView',
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'views/users/UsersListView',
  'text!templates/users/usersTemplate.html',
  'backbone.forms',
  //'backbone.forms.list'
  'jquery.ui'
], function($, _, Backbone, /*SidebarView, */UserModel, UsersCollection, UsersListView, usersTemplate){

  var ProjectsView = Backbone.View.extend({
    el: "#page",
    initialize: function(){
      this.usersCollection = new UsersCollection;
      this.usersCollection.fetch();
    },
    render: function(){
      console.log('render userEditView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      var user = new UserModel();
      var form = new Backbone.Form({
          model: user
      }).render();
      console.log(form.el);
      this.$el.html(form.el);
    }
  });

  return ProjectsView;
});

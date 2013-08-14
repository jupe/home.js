// Filename: views/users/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!templates/users/usersListTemplate.html'

], function($, _, Backbone, UserModel, UsersCollection, usersListTemplate){
  var UserListView = Backbone.View.extend({
    el: $("#users-list"),

    render: function(){
      
      var data = {
        users: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( usersListTemplate, data );
      $("#users-list").html( compiledTemplate ); 
    }
  });
  return UserListView;
});

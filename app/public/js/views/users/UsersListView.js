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
    el: $("#user-list"),
    initialization: function(){
    },
    render: function(){
      console.log('render UsersListView');
      var data = {
        users: this.collection.models,
        _: _ 
      };

      var compiledTemplate = _.template( usersListTemplate, data );
      $("#user-list").html( compiledTemplate ); 
    }
  });
  return UserListView;
});

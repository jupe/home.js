define([
  'jquery',
  'underscore',
  'backbone',
  'models/user/UserModel'
], function($, _, Backbone, UserModel){

  var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: "/api/v0/user",
    initialize: function(){
      /*this.fetch({
        success: function() {
          console.log("Users loaded successful");
        },
        error: function(){
          console.log('There was some error in loading and processing the users');
        }
      });*/
    }

  });
 
  return UserCollection;
});

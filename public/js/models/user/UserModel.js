define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var UserModel = Backbone.Model.extend({

    idAttribute: "name",
    /*initialize: function() {  },

    allowedToEdit: function(account) {
      return true;
    },
    validate: function(attrs, options) {
      return true;
    }
    */

  });

  return UserModel;

});
define([
  'underscore',
  'backbone',
  'backbone.forms',
], function(_, Backbone, Form) {
  
  var UserModel = Backbone.Model.extend({

    idAttribute: "name",
    schema: {
      name:       'Text',
      //email:      { validators: ['required', 'email'] },
      password:   'Password',
      //notes:      { type: 'List', itemType: 'Text' }
    }
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
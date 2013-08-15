define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var EventModel = Backbone.Model.extend({

    idAttribute: "uuid",
    /*initialize: function() {  },

    allowedToEdit: function(account) {
      return true;
    },
    validate: function(attrs, options) {
      return true;
    }
    */

  });

  return EventModel;

});
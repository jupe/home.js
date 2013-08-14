var Event = Backbone.Model.extend({

  initialize: function() {  },

  validate: function(attrs, options) {
    return true;
  }

});



/*
var one = new Event({author: });
one.on("invalid", function(model, error) {
  alert(model.get("title") + " " + error);
});
*/

var EventLibrary = Backbone.Collection.extend({
  model: Event
});
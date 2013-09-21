/*
var s = new Schedule({name: 'test'})
one.on("invalid", function(model, error) {
  alert(model.get("name") + " " + error);
});
*/
var Action = Backbone.Model.extend({
  
  initialize: function() {  },
  
  enable: function() {
  },
  disable: function() {
  },
  
  validate: function(attrs, options) {
    return attr.name!='';
  }

});

var LibAction = Backbone.Collection.extend({
  model: Action,
  url: "/api/v0/action.json",
  initialize: function(){
    this.fetch({
      success: function() {
        console.log("JSON file load was successful");
      },
      error: function(){
        console.log('There was some error in loading and processing the JSON file');
      }
    });
  },
  addAction: function(action){
    postJSON(action, this.url, function(error, doc){
      if(doc)this.add(doc);
    });
  },
  removeAction: function(action){
    deleteJSON(action.uuid, this.url, function(error, ok){
      if(ok)this.remove(doc);
      this.remove(action);
    });
  }
});
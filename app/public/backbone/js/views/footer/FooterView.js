define([
  'jquery',
  'underscore',
  'backbone',
  'models/owner/OwnerModel',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, OwnerModel, footerTemplate){

  var FooterView = Backbone.View.extend({
    el: $("#footer"),

    initialize: function() {

      var that = this;
      var options = {query: 'jupe'}
     

      var onDataHandler = function(collection) {
          that.render();
      }

      this.model = new OwnerModel(options);
      this.model.fetch({ success : onDataHandler, dataType: "jsonp"});

    },

    render: function(){
      console.log('render footerView');
      var data = {
        owner: this.model.toJSON(),
        _: _ 
      };

      var compiledTemplate = _.template( footerTemplate, data );
      this.$el.html(compiledTemplate);
    }

  });

  return FooterView;
  
});

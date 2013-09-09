define([
  'jquery',
  'underscore',
  'backbone',
  //'views/sidebar/SidebarView',
  'models/automation/action/ActionModel',
  'collections/automation/action/ActionsCollection',
  'views/automation/action/ActionListView',
  'text!templates/automation/action/actionsTemplate.html'
], function($, _, Backbone, /*SidebarView, */ActionModel, ActionsCollection, ActionListView, actionsTemplate){

  var ActionView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      
    },
    render: function(){
      console.log('render actionView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(actionsTemplate);
      
      
      this.actionsCollection = new ActionsCollection;
      var self = this;
      this.actionsCollection.fetch({
        success: function() {
            var actionListView = new ActionListView({ collection: self.actionsCollection}); 
            actionListView.render();
        }
      });      

      // add the sidebar 
      //var sidebarView = new SidebarView();
      //sidebarView.render();

    }
  });

  return DevicesView;
});

// Filename: views/devices/list
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/automation/automationTemplate.html'

], function($, _, Backbone, automationTemplate){
  var AutomationView = Backbone.View.extend({
    el: $("#page"),

    render: function(){
      console.log('render AutomationView');
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(automationTemplate);
      
      var compiledTemplate = _.template( automationTemplate, {} );
      $("#automation").html( compiledTemplate ); 
    }
  });
  return AutomationView;
});

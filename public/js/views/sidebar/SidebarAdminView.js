define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/sidebar/adminTemplate.html'
], function($, _, Backbone, sidebarTemplate){

  var SidebarView = Backbone.View.extend({
    el: $(".sidebar"),

    render: function(){
      console.log('render SidebarAdminView');
      var that = this;
      var data = { links: []};
      data.links.push( {  site_url : "/#/user" ,
                          /*image_url : "./imgs/user.png",*/
                          title : "User",
                          description: "Handle users" } );

      data.links.push( {  site_url : "/#/group" ,
                          /*image_url : "./imgs/group.png",*/
                          title : "Group",
                          description: "Handle groups" } );

      var compiledTemplate = _.template( sidebarTemplate, data );
    
      $(".sidebar").append(compiledTemplate);
    }

  });

  return SidebarView;
  
});

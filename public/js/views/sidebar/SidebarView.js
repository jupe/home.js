define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/sidebar/sidebarTemplate.html'
], function($, _, Backbone, sidebarTemplate){

  var SidebarView = Backbone.View.extend({
    el: $(".sidebar"),

    render: function(){

      var that = this;

      var homejs_ad = {  site_url : "http://www.github.com/jupe/home.js" ,
                          image_url : "./imgs/homejs.png",
                          title : "Home.js",
                          description: "Home.js is general purpose home automation framework." };

      var node_ad = {  site_url : "http://http://nodejs.org/" ,
                          image_url : "http://nodejs.org/images/logo.png",
                          title : "Node.js",
                          description: "Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications." };
     
      var mongo_ad = {    site_url : "http://www.mongodb.org/" ,
                          image_url : "http://media.mongodb.org/logo-mongodb.png",
                          title : "MongoDB",
                          description: "MongoDB (from 'humongous') is an open-source document database, and the leading NoSQL database. Written in C++." };
      
      var backbone_ad = { site_url : "http://www.backbonejs.org" ,
                          image_url : "./imgs/backbone_logo.png",
                          title : "Backbone.js",
                          description: "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface." };

      

      var data = {
        ads: [homejs_ad, node_ad, mongo_ad, backbone_ad]
      };

      var compiledTemplate = _.template( sidebarTemplate, data );
    
      $(".sidebar").append(compiledTemplate);
    }

  });

  return SidebarView;
  
});

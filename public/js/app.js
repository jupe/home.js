// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'jquery.event.drag',
  'jquery.ui.sortable',
  'router', // Request router.js
], function($, _, Backbone, jed, jus, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  };

  return { 
    initialize: initialize
  };
});

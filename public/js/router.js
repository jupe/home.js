// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/home/AdminView',
  'views/home/InfoView',
  'views/users/UsersView',
  'views/contributors/ContributorsView',
  'views/devices/DeviceView',
  'views/footer/FooterView'
], function($, _, Backbone, 
    HomeView, 
    AdminView, 
    InfoView, 
    UsersView, 
    ContributorsView, 
    DevicesView, 
    FooterView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'user': 'showUsers',
      'contributor': 'showContributors',
      
      'device': 'showDevices',
      'device/:uuid': 'showDevice',
      
      'admin': 'showAdmin',
      'info': 'showInfo',
      // Default
      '*action': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;
    
    app_router.on('route:showAdmin', function (actions) {
     
       // We have no matching route, lets display the home page 
        var adminView = new AdminView();
        adminView.render();
    });
    app_router.on('route:showUsers', function(){
   
        // Call render on the module we loaded in via the dependency array
        var usersView = new UsersView();
        usersView.render();
    });
  
    app_router.on('route:showContributors', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        var contributorsView = new ContributorsView();
    });
    
    app_router.on('route:showDevices', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        var devicesView = new DevicesView();
        devicesView.render();
    });
    
    app_router.on('route:showInfo', function (actions) {
     
       // We have no matching route, lets display the home page 
        var infoView = new InfoView();
        infoView.render();
    });

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});

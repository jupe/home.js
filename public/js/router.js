// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/LoginView',
  'views/home/HomeView',
  'views/home/AdminView',
  'views/home/InfoView',
  'views/automation/AutomationView',
  //'views/automation/schedule/ScheduleView',
  //'views/automation/action/ActionView',
  'views/events/EventView',
  'views/users/UsersView',
  'views/users/UserEditView',
  'views/contributors/ContributorsView',
  'views/devices/DeviceView',
  'views/footer/FooterView',
], function($, _, Backbone, 
    LoginView,
    HomeView, 
    AdminView, 
    InfoView, 
    AutomationView, //ScheduleView, ActionView,
    EventView,
    UsersView,UserEditView,
    ContributorsView, 
    DeviceView, 
    FooterView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      
      // Define URL routes
      'login': 'login',
      
      'device': 'showDevices',
      'device/:uuid': 'showDevice',
      
      
      'automation': 'showAutomation',
      
      'event': 'showEvents',
      'event/:uuid': 'showEvent',
      'admin': 'showAdmin',
      'user': 'showUsers',
      'user/:name': 'editUser',
      
      'info': 'showInfo',
      'contributor': 'showContributors',
      
      // Default
      '*action': 'defaultAction'
    }
  });
  
  var initialize = function(){

    console.log('initialize router');
    var app_router = new AppRouter;
    
    window.homejs = window.homejs?window.homejs:{Router: app_router}; 
    
    console.log('Create route events');
    var eventView = new EventView();
    var automationView = new AutomationView();
    var adminView = new AdminView();
    var usersView = new UsersView();
    var infoView = new InfoView();
    var homeView = new HomeView();
    var deviceView = new DeviceView();
    var loginView = new LoginView();
    var contributorsView = new ContributorsView();
    
    app_router.on('route:login', function (actions) {
      loginView.render();
    });
    
    app_router.on('route:showAutomation', function (actions) {
     
       // We have no matching route, lets display the home page 
        automationView.render();
    });
    
    app_router.on('route:showEvents', function (actions) {
     
       // We have no matching route, lets display the home page 
        eventView.render();
    });
    
    app_router.on('route:showAdmin', function (actions) {
     
       // We have no matching route, lets display the home page 
        
        adminView.render();
    });
    app_router.on('route:showUsers', function(){
   
        // Call render on the module we loaded in via the dependency array
        
        usersView.render();
    });
     app_router.on('route:editUser', function(){
   
        // Call render on the module we loaded in via the dependency array
        var editView = new UserEditView();
        editView.render();
    });
  
    app_router.on('route:showContributors', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        
        contributorsView.load();
    });
    
    app_router.on('route:showDevices', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        
        deviceView.render();
    });
    
    app_router.on('route:showInfo', function (actions) {
     
       // We have no matching route, lets display the home page 
        
        infoView.render();
    });

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        
        homeView.render();
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    var footerView = new FooterView();

    Backbone.history.start();
    
    Backbone.history.on('route', function (route, fname, arg) {
      console.log('routing-->'+fname);
    });
  };
  return { 
    initialize: initialize
  };
});

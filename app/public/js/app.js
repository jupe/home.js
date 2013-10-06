'use strict';


// Declare app level module which depends on filters, and services
angular.module('homejs', ['ngRoute', 'ui.bootstrap', 'ngGrid', 'ui.chart', /*'n3-charts.linechart', 'googlechart',*/ 'homejs.controllers', 'homejs.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/overview.html', controller: 'OverviewController'});
    $routeProvider.when('/charts', {templateUrl: 'partials/charts.html', controller: 'ChartsController'});
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: 'DevicesController'});
    $routeProvider.when('/events', {templateUrl: 'partials/events.html', controller: 'EventsController'});
    $routeProvider.when('/actions', {templateUrl: 'partials/actions.html', controller: 'ActionsController'});
    $routeProvider.when('/schedules', {templateUrl: 'partials/schedules.html', controller: 'SchedulesController'});
    $routeProvider.when('/admins', {templateUrl: 'partials/admins.html', controller:
    'AdminController'});
    $routeProvider.when('/admins/configurations', {templateUrl: 'partials/admin.configurations.html', controller: 'AdminConfigurationController'});
    $routeProvider.when('/services', {templateUrl: 'partials/services.html', controller: 'ServiceController'});
    $routeProvider.when('/services/:serviceId/edit', {
      templateUrl: 'partials/service.edit.html', controller: 'ServiceEditController', 
      resolve: {
          service: function(Service, $route){
            return Service.rest.query({name:$route.current.params.serviceId});
          }
        }});
    /*$routeProvider.when('/admins/services', {templateUrl: 'partials/admin.service.html', controller: 'AdminController'});
    $routeProvider.when('/admins/configuration', {templateUrl: 'partials/admin.service.html', controller: 'AdminController'});*/
    $routeProvider.when('/info', {templateUrl: 'partials/info.html', controller: 'InfoController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
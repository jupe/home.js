'use strict';


// Declare app level module which depends on filters, and services
angular.module('homejs', ['ngRoute', 'ui.bootstrap', 'ngGrid',  /*'n3-charts.linechart',*/ 'googlechart', 'homejs.controllers', 'homejs.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/overview.html', controller: 'OverviewController'});
    $routeProvider.when('/charts', {templateUrl: 'partials/charts.html', controller: 'ChartsController'});
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: 'DevicesController'});
    $routeProvider.when('/events', {templateUrl: 'partials/events.html', controller: 'EventsController'});
    $routeProvider.when('/info', {templateUrl: 'partials/info.html', controller: 'InfoController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
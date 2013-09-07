'use strict';


// Declare app level module which depends on filters, and services
angular.module('homejs', ['ngRoute', 'ui.bootstrap', 'homejs.controllers', 'homejs.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/overview.html', controller: 'OverviewController'});
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: 'DevicesController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

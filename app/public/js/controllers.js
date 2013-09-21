'use strict';

/* Controllers */

angular.module('homejs.controllers', [])
  .controller('OverviewController', [function() {
  
  }])
  .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
    $scope.devices = Device.query();
  }])
  .controller('EventsController', ['$scope', 'Event', function($scope, Event) {
    $scope.events = Event.query();
  }])
  .controller('InfoController', [function() {
    $scope.version = 'test';
    $scope.commitid = '1234';
  }]);

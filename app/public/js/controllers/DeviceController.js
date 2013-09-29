'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
    $scope.devices = Device.query();
  }]);
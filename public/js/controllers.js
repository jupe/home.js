'use strict';

/* Controllers */

angular.module('homejs.controllers', []).
    controller('OverviewController', [function() {
	
    }])
    .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
	$scope.devices = Device.query();
    }]);

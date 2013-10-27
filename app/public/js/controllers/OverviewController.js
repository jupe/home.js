'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('OverviewController', ['$scope', '$timeout', 'Device', function($scope, $timeout, Device) {
  
    var devices = Device.query( function(){
      $scope.devicesCount = devices.length;
      devices.forEach( function(device){
        device.sensors.forEach(function(sensor){
        });
      });    
    });
    
    function updateTime(){
      $scope.time = moment().format("YYYY/MM/DD hh:mm:ss");
      console.log("updated time");
      console.log("updated time");
      $timeout(updateTime, 1000);
    }
    updateTime();
  }]);
 
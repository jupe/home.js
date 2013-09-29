'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('AdminConfigurationController', ['$scope', 'Configure', function($scope, Configure) {
    //Controller for service page
   Configure.get().then( function(response){
     $scope.config = response.data;
     $scope.port = response.data.app.port;
     $scope.email = response.data.email.from;
     $scope.port = response.data.app.port;
   });
   
   $scope.changed = function(){
    console.log('something changed: '+$scope.port);
   }
  }]);
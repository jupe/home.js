'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('AdminConfigurationController', ['$scope', 'Configure', function($scope, Configure) {
    //Controller for service page
   Configure.get().then( function(response){
     $scope.config = response.data;
   });
   $scope.showSave = false;
   $scope.changed = function(){
    $scope.showSave = true;
   }
   $scope.save = function(){
    console.log('Saving..: '+JSON.stringify());
    Configure.save($scope.config).then( function(response){
        console.log('Saving..: '+JSON.stringify());
    });
   }
  }]);
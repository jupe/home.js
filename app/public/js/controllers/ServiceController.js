'use strict';

/* Controllers */

angular.module('homejs.controllers')
  
  /*.filter('switchStatus', function() {
    return function(input) {
      console.log(input);
      return (input == 'enable') ? 'STOP' : 'START';
    }
  })*/
  .controller('ServiceController', ['$scope', 'Service', function($scope, Service) {
    //Controller for service page
    
    $scope.services = Service.rest.query({fl: true});
    
    
    /*
    ng-grid way
    $scope.button = {style: "display: none;", fnc: 'start'}
    $scope.gridOptions = { 
      data: 'services',
      //enablePaging: true,
      //showFooter: true,
      //showGroupPanel: true,
      enableRowSelection: true,
      enableCellEdit: true,
      columnDefs: [
        { field: 'enable', width: 80, displayName: 'Running' },
        {field: 'name', displayName: 'Name', width: 100, enableCellEdit: false},
        //cellTemplate: '/partials/cell/switchTemplate.html' }
        //{field: 'enable', displayName: 'Running', width: 80, enableCellEdit: true,
        //editableCellTemplate: '<input type="checkbox" ng-class="" ng-model="enable"/>'},
      ],
      
      //multiSelect: false,
      //selectedItems: $scope.mySelections,
      afterSelectionChange: function(data) {
        console.log( "afterSelectionChange: ", data.entity )
        $scope.currentStatus = data.entity.enable?"Running":"stopped";
        $scope.place = data.entity['configurations.place'];
        $scope.nCustomerID = data.entity['configurations.nCustomerID'];
        $scope.button = {
          style: "display: default;",
          value: data.entity.enable?"stop":"start",
          fnc: data.entity.enable?"stop":"start",
        }
      }
    };
    $scope.$watch($scope.place, function() {
      console.log("Changed to " + $scope.$eval($scope.place));
    });
    $scope.changeStatus = function(id, status) {
      console.log(status);
      $scope.currentStatus = enable;
      if(enable == 'STOPPED') {
        $scope.myData = [{enable: 'STARTED'}];
      } else {
        $scope.myData = [{status: 'STOPPED'}];
      }
      $scope.nextStatus = $filter('switchStatus')(enable);
    }
    $scope.stop = function(row){
      console.log('stop'+row);
    }
    $scope.start = function(row){
      console.log('start'+row);
    }*/
  }])
  .controller('ServiceEditController', ['$scope', '$location', 'service', function($scope, $location, service) {
    var original = service[0];
    $scope.service = service[0];
    //$scope.service = Service.rest.get(original); save
  

    $scope.isClean = function() {
      //return angular.equals(original, $scope.service);
      return false;
    }
    $scope.save = function() {
      $scope.service.$update();
    };
  }]);
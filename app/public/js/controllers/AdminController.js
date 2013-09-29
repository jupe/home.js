'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('AdminController', ['$scope', 'Configure', 'Service', function($scope, Configure, Service) {
    //Controller for admin page
    
    
    Configure.get().then( function(response){
      //$scope.configurations = response.data;
      //console.log(response.data);
      
    });;
    
    $scope.services = Service.rest.query({fl: true});
    
    $scope.gridOptions = { 
      data: 'services',
      //enablePaging: true,
      //showFooter: true,
      //showGroupPanel: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'enable', displayName: 'Enable', width: 100},
        {field: 'name', displayName: 'Name', width: 100},
      ]
    };
  }]);
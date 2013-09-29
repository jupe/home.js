'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('ServiceController', ['$scope', 'Service', function($scope, Service) {
    //Controller for service page
    
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
'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('GroupsController', ['$scope', 'Group', function($scope, Group) {
    
    $scope.groups = Group.query({fl: true});
    $scope.gridOptions = { 
      data: 'groups',
      //showFooter: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'name', displayName: 'Name', width: 100},
        {field: 'lastAction', displayName: 'Last Action', width: 100},
      ]
    };
  }]);
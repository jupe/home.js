'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('UsersController', ['$scope', 'User', function($scope, User) {
    
    $scope.users = User.query({fl: true});
    $scope.gridOptions = { 
      data: 'users',
      //showFooter: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'name', displayName: 'Name', width: 100},
        {field: 'email', displayName: 'Email', width: 250},
        {field: 'lastAction', displayName: 'Last Action', width: 100},
      ]
    };
  }]);
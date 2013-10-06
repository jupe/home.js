'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('ActionsController', ['$scope', 'Action', function($scope, Action) {
    
    $scope.actions = Action.query({fl: true});
    var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }
    $scope.gridOptions = { 
      data: 'actions',
      //showFooter: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'enable', displayName: 'Enabled', width: 70 },
        {field: 'name', displayName: 'Name', width: 100},
        {field: 'type', displayName: 'Type', width: 70},
        {field: 'lastAction', displayName: 'Last Action', width: 100},
      ]
    };
  }]);
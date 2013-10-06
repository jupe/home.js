'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('SchedulesController', ['$scope', 'Schedule', function($scope, Schedule) {
    
    $scope.schedules = Schedule.query({fl: true});
    //var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }
    $scope.gridOptions = { 
      data: 'schedules',
      //enablePaging: true,
      //showFooter: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'enable', displayName: 'Enabled', width: 70 },
        {field: 'name', displayName: 'Name', width: 100},
        {field: 'cron', displayName: 'Cron', width: 100},
        {field: 'lastTriggered', displayName: 'Last Triggered', width: 150},
      ]
    };
  }]);
'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
    
    $scope.devices = Device.query({fl: true});
    var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }
    $scope.gridOptions = { 
      data: 'devices',
      //enablePaging: true,
      //showFooter: true,
      showGroupPanel: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'enable', displayName: 'Enabled', width: 70, groupable: false },
        {field: 'type', displayName: 'Type', width: 70, groupable: true},
        {field: 'name', displayName: 'Name', width: 100},
        {field: 'created.timestamp', displayName: 'Created', width: 100},
        {field: 'modified.timestamp', displayName: 'Modified', width: 100}
      ]
    };
  }]);
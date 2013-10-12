'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
    $scope.devices = Device.query({fl: true});
    
    $scope.afterCellEdit = function () {
      alert("Edited");
    };
    $scope.cellValue;
    $scope.updateEntity = function(column, row, cellValue) {
        //console.log(row.entity);
        //console.log(column.field);
        console.log( column.field+' -> '+row.entity[ column.field ] );
        row.entity[column.field] = cellValue;
        //row.entity.$update() // <- the simple case
        //Device.save({column.field: cellValue});
        
        // I have nested Entity / data in the row <- the complex case
        // var answer = new Answer(question.answers[answerIndex]); // answerIndex is computed with "column.field" variable
        // answer.$update() ...
    };
    var cellEditableStringTemplate = "<input ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, COL_FIELD)\" ng-model=\"COL_FIELD\" />"
    /*
    var cellEditableStringTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"string\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";*/
    
    /*var cellEditableNumberTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"number\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";*/
    
    var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }
    
    $scope.gridOptions = { 
      data: 'devices',
      
      showFooter: true,
      showGroupPanel: true,
      enableCellSelection: true,
      enableRowSelection: false,
      jqueryUIDraggable: true,
      
      /*
      enablePaging: true,
      selectedItems: $scope.selected,
      showSelectionCheckbox: true,
      multiSelect: true,
      selectWithCheckboxOnly: true,
      keepLastSelected: false,*/
      plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'enable', displayName: 'Enabled', width: 70, groupable: true, 
          enableCellEdit: true, 
          editableCellTemplate: '/lib/ng-grid/templates/checkboxCellTemplate.html' 
        },
        {field: 'type', displayName: 'Type', width: 70, groupable: true},
        {field: 'name', displayName: 'Name', width: 150, enableCellEdit: true, editableCellTemplate: cellEditableStringTemplate},
        {field: 'created.timestamp', displayName: 'Created', width: 100},
        {field: 'modified.timestamp', displayName: 'Modified', width: 100}
      ]
    };
    
  }]);
'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('EventsController', ['$scope', 'Event'/*, 'Configure'*/, function($scope, Event/*, Configure*/) {
    
    $scope.events = Event.query({fl: true});
    
    /* just for testing
    Configure.get().then( function(response){
      console.log(response);
    });*/
    
    
    /*$scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [25, 100, 500],
        pageSize: 25,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.events = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('largeLoad.json').success(function (largeLoad) {		
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);*/
    var csvOpts = { columnOverrides: { obj: function(o) { return o.a + '|' +  o.b; } } }
    $scope.gridOptions = { 
      data: 'events',
      //enablePaging: true,
      showFooter: true,
      showGroupPanel: true,
      plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'type', displayName: 'Type', width: 50, groupable: true},
        {field: 'created.timestamp', displayName: 'Timestamp', width: 100},
        {field: 'source.name', displayName: 'Source', groupable: true, width: 100},
        {field: 'msg', displayName: 'Message', resizable: true, groupable: false }
      ]
    };
  }]);
'use strict';

/* Controllers */

angular.module('homejs.controllers', [])
  .controller('OverviewController', ['$scope',function($scope) {
    
    /*
    // d3js:
    var scope = $scope;
    $.getJSON('http://localhost:3000/api/v0/timeserie/637670f1-2371-11e3-bbe5-0f40648d40c4/hourly', function(data){
      var arr = []
      data.forEach( function(row){
        arr.push( {x: new Date(row[0]), value: row[1] } );
      });
      scope = arr;
    });
    var today = new Date();
    var after = function(hour)
    {
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours()+hour
      );
    }
    $scope.data = [
      {x: after(0), value: 4   },
      {x: after(1), value: 8   },
      {x: after(2), value: 15  },
      {x: after(2), value: 16  },
      {x: after(3), value: 23  },
      {x: after(4), value: 4  }
    ];
    $scope.options = {
      axes: {
        x: {type: 'date', tooltipFormatter: function(x) {return x;}}
      },
      series: [
        {y: 'value', color: 'steelblue', min: 0, type: 'area', label: 'Power consumption kWh'},
      ],
      lineMode: 'linear'
    }
    */
    
    //google chart:
    var scope = $scope;
    $scope.chart = {
      "type": "LineChart",
      "displayed": true,
      "cssStyle": "height:300px; width:100%;",
      "data": {       
        "cols": [
          {id: "date",  label: "Month", type: "string"},
          {id: "value", label: "Sensor#X", "type": "number" },
        ],
        "rows": [
          {
            "c": [
              {
                "f": "January",
                "v": -30
              },
              {              
                "v": -5
              }
            ]
          }
        ] 
      },
      "options": {
        "title": "Power consumption avg per month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": { "title": "Power consumption [kWh]", "gridlines": { "count": 10 }, min: -30, max: 30 },
        "hAxis": { "title": "Date" },
        "tooltip": { "isHtml": false }
      },
      "formatters": {}
    }
    /*
    $.getJSON('http://localhost:3000/api/v0/timeserie/637670f1-2371-11e3-bbe5-0f40648d40c4/hourly', function(json){
      var arr = [];
      var i;
      for(i=0;i<json.length;i++){
        //var obj = {"v": new Date(json[i][0]), "v": json[i][1]};
        arr.push( {v: '1', v: 4} );
        
      }
      scope.chart.data.rows[0].c = arr;
      //console.log(scope);
    });
    */
    
  }])
  .controller('DevicesController', ['$scope', 'Device', function($scope, Device) {
    $scope.devices = Device.query();
  }])
  .controller('EventsController', ['$scope', 'Event', function($scope, Event) {
    
    $scope.events = Event.query({fl: true});
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
  }])
  .controller('InfoController', ['$scope', function($scope) {
    $scope.version = 'test';
    $scope.commitid = '1234';
  }]);

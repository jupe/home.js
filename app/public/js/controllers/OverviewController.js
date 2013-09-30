'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('OverviewController', ['$scope', 'Device', 'Timeserie', function($scope, Device, Timeserie) {

    // @todo how to fetch devices and those sensors timeseries data
    /*
    Device.query().forEach( function(device){
      console.log(device);
    });*/
    // this is hardcoded sensor uuid
    Timeserie.getHourly({uuid: '637670f0-2371-11e3-bbe5-0f40648d40c4'}).then( function(response){
      response.forEach( function(row, key){
        row[0] = new Date(row[0]);
      });
      $scope.someData = [response]
    });

    $scope.myChartOpts = { 
        title:'',
        axes:{
          xaxis:{
            renderer:$.jqplot.DateAxisRenderer,
            tickOptions:{
              formatString:'%b&nbsp;%#d'
            } 
          },
          yaxis: {
            tickOptions:{
              formatString:'%.2f C'
              }
          }
        },
        legend: { show:true, location: 'e' },
        highlighter: {
          show: true,
          sizeAdjust: 7.5
        },
        cursor: {
          show: false
        }
      }
    
    // d3js:
    /*
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
    /*
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
    }*/
    /*    $.getJSON('http://localhost:3000/api/v0/timeserie/637670f1-2371-11e3-bbe5-0f40648d40c4/hourly', function(json){
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
    
  }]);
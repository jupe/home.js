'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('ChartsController', [
    '$scope', 'Device', 'Timeserie', 
  function($scope, Device, Timeserie, $timeout) {
    //Controller for charts page
    
    $scope.fetchChart = function()
    {
      if( $scope.sensor.unit ) {
        $scope.myChartOpts.axes.yaxis.tickOptions.formatString = 
          '%.2f '+$scope.sensor.unit;
      }
      $scope.myChartOpts.series = [{
        label: $scope.device.name+':'+$scope.sensor.name
      }];
    
      Timeserie.getHourly({uuid: $scope.sensor.uuid})
      .then( function(response){
        $scope.len = 0;
        $scope.total = 0;
        if( response.length > 0 ){
          response.forEach( function(row, key){
            row[0] = new Date(row[0]);
            $scope.total += row[1];
            $scope.len++;
          });
          $scope.someData = [response];
        }
      });
    }
    $scope.devices = Device.query( function(){
      $scope.device = $scope.devices[0];
      return;
      /*$scope.devices.forEach( function(device){
        device.sensors.forEach(function(sensor){
          Timeserie.getHourly({uuid: sensor.uuid})
            .then( function(response){
              if( response.length > 0 ){
                response.forEach( function(row, key){
                  row[0] = new Date(row[0]);
                });
                if( ! $scope.someData )
                  $scope.someData = [response];
                else
                  $scope.someData.push(response);
              }
            });
        });
      });*/
    });    
    
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();
    $scope.open = function() {
      $timeout(function() {
        $scope.opened = true;
      });
    };
    $scope.dateOptions = {
      'year-format': "'yy'",
      'starting-day': 1
    };
    
    //$scope.chartOptions = [ohlc];
    $scope.myChartOpts = { 
        title:'',
        axes:{
          xaxis:{
            renderer:$.jqplot.DateAxisRenderer,
            tickOptions:{
              formatString:'%#d/%#m/%Y %#H:0'
            },
            tickInterval: "2 weeks",
          },
          yaxis: {
            tickOptions:{
              formatString:'%.2f'
              }
          }
        },
        seriesDefaults: {
          showMarker:false,
          //renderer:$.jqplot.OHLCRenderer
        },
        legend: { show:true, location: 'e' },
        highlighter: {
          show: true,
          showMarker:false,
          sizeAdjust: 7.5,
          //yvalues: 4,
          
        },
        cursor: {
          show: false,
          zoom:true, 
        }
      }
    
  }]);
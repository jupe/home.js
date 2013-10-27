'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('entertainmentTvNowController', ['$scope', 'eViihde', function($scope, eViihde) {
    //channel=MTV3&showdate=11.10.2012
    eViihde.get(moment().format("DD.MM.YYYY")).then( function(response){
      var table = []
      for(var channel in response.data.channels[0]){
        for(var i in response.data.channels[0][channel]){
          var show = response.data.channels[0][channel][i];
          /*
            id: "792077",
            name: "Viidenkympin%20villitys%20(7)",
            simple_start_time: "00:10",
            simple_end_time: "01:10",
            start_time: "11.10.2012 00:10:00",
            end_time: "11.10.2012 01:10:00",
            short_text: "Virran%20viet%
          */
          var row = {
            channel       : channel,
            show          : show.name, //_.unescape(show.name),
            date          : moment(show.start_time, "DD.MM.YYYY").format("DD.MM.YYYY"),
            time          : show.simple_start_time, 
            duration      : moment(show.simple_end_time, "hh:mm:ss")
                              .diff(moment(show.simple_start_time, "hh:mm:ss"))/1000/60
                              +' min',
            description   : show.short_text,
          }
          table.push(row);
        }
      }
      $scope.tvNow = table;
    });
    $scope.gridOptions = { 
      data: 'tvNow',
      showFooter: true,
      showGroupPanel: true,
      enableCellSelection: true,
      enableRowSelection: false,
      jqueryUIDraggable: true,
      //plugins: [new ngGridCsvExportPlugin(csvOpts)],
      //totalServerItems: 'totalServerItems',
      //pagingOptions: $scope.pagingOptions,
      columnDefs: [
        {field: 'date', displayName: 'Date', width: 100},
        {field: 'time', displayName: 'Time', width: 80},
        {field: 'channel', displayName: 'Channel', width: 100},
        {field: 'show', displayName: 'Show', width: 200},
        {field: 'duration', displayName: 'Duration', width: 70},
        {field: 'description', displayName: 'Description', width: 300},
      ]
    };
  }]);
  
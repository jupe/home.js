'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('InfoController', ['$scope', 'Commit', 'CommitsAhead', function($scope, Commit, CommitsAhead) {
    Commit.get().then( function(response){
      //console.log(response.data);
      /*results.get().then( function(results){
        $scope.commit = results.data.commit;
      });*/
      $scope.commit = response.data;
    });
    CommitsAhead.get().then( function(response){
      //console.log(response.data);
      /*results.get().then( function(results){
        $scope.commit = results.data.commit;
      });*/
      $scope.commitAhead = response.data;
    });
  }]); 
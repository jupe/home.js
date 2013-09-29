'use strict';

/* Controllers */

angular.module('homejs.controllers', [])
  .controller('InfoController', ['$scope', function($scope) {
    $scope.version = 'test';
    $scope.commitid = '1234';
  }]);

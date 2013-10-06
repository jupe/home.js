'use strict';

/* Controllers */

angular.module('homejs.controllers')
  .controller('LoginController', ['$scope', '$http', 'UserAuthentication', function($scope, $http,User) {
    $scope.user = User;
    $scope.login = function() {
        var config = { 
          url:"/api/v0/login",
          method: 'POST',
          data : {name: $scope.session.username, password: $scope.session.password}
        }
        $http(config)
        .success(function(data, status, headers, config) {
          if (data.status) {
            // succefull login
            User.isLogged = true;
            User.username = data.name;
          }
          else {
            User.isLogged = false;
            User.username = '';
          }
        })
        .error(function(data, status, headers, config) {
          User.isLogged = false;
          User.username = '';
        });
      }
    
    
  }]);
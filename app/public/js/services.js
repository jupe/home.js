'use strict';

/* Services */

// TODO: Should configure root url for API calls in single config setting
angular.module('homejs.services', ['ngResource'])
  .factory('Device', function($resource) {
    return $resource(
	    "/api/v0/device/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Event', function($resource) {
    return $resource(
	    "/api/v0/event/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('User', function($resource) {
    return $resource(
	    "/api/v0/user/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Group', function($resource) {
    return $resource(
	    "/api/v0/group/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Schedule', function($resource) {
    return $resource(
	    "/api/v0/schedule/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Action', function($resource) {
    return $resource(
	    "/api/v0/action/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Rule', function($resource) {
    return $resource(
	    "/api/v0/rule/:id", {id: '@uuid'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Configure', function($http) {
    return {
      get: function(params){
        return $http.get("/api/v0/admin/configure", {
            params: params
          });
      }
    }
  })
  .factory('Timeserie', function($http) {
    return {
      getRaw: function(params){
        return $http.get("/api/v0/timeserie/"+params.uuid)
          .then(function(result){
            return result.data;
          });
      },
      getHourly: function(params){
        return $http.get("/api/v0/timeserie/"+params.uuid+'/hourly', {params : params})
          .then(function(result){
            return result.data;
          });
      }
    }
  });

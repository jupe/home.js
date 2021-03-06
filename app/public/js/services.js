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
	    "/api/v0/user/:id", {id: '@name'},
	    {update: {method: "PUT"}}
    );
  })
  .factory('Group', function($resource) {
    return $resource(
	    "/api/v0/group/:id", {id: '@name'},
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
  .factory('Configure', function($resource, $http) {
    return {
      get: function(params){
        return $http.get("/api/v0/admin/configure", {
            params: params
          });
      },
      save: function(configure){
        return $http.put("/api/v0/admin/configure", configure);
      },
      rest: $resource(
        "/api/v0/admin/configure/:id", {id: '@name'}, {update: {method: "PUT"}}
      ) 
    }
  })
  .factory('Service', function($resource, $http) {
    return {
      rest: $resource(
        "/api/v0/service/:id", {id: '@name'},
        {update: {method: "PUT"}}
      ),
      stop: function(service){
        return $http.post("/api/v0/service/"+service.name+"/stop")
         .then( function(result){
          console.log(result);
          console.log("stop ok");
         });
      },
      start: function(service){
        return $http.post("/api/v0/service/"+service.name+"/start")
         .then( function(result){
          console.log(result);
          console.log("start ok");
         });
      }
    };
  })
  .factory('UserAuthentication', function(){
    var sdo = {
      isLogged: false,
      username: ''
    };
    return sdo;
  })
  .factory('Commit', function($http){
    return {
      get: function() { 
        return $http.get("/api/v0/admin/commit").then( function(results){
            return $http.get("https://api.github.com/repos/jupe/home.js/commits/"+results.data.id);
        });
      }
    }
  })
  .factory('CommitsAhead', function($http){
    return {
      get: function() { 
        return $http.get("/api/v0/admin/commit").then( function(results){
            return $http({
              method: 'GET',
              url: "https://api.github.com/repos/jupe/home.js/commits", 
              params : {since: results.data.timestamp} 
            });
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
        return $http.get("/api/v0/timeserie/"+params.uuid+'/hourly', {params : params.query})
          .then(function(result){
            return result.data;
          });
      }
    }
  });

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
  });;

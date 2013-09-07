'use strict';

/* Services */

// TODO: Should configure root url for API calls in single config setting

angular.module('homejs.services', ['ngResource']).
    factory('Device', function($resource) {
	return $resource(
	    "/api/v0/device/:id.json", {id: '@uuid'},
	    {update: {method: "PUT"}}
	);
    });

'use strict';

/* Services */


angular.module('homejs.services', ['ngResource']).
    factory('Device', function($resource) {
	return $resource(
	    "/api/v0/device/:id.json", {id: '@uuid'},
	    {update: {method: "PUT"}}
	);
    });

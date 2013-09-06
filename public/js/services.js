'use strict';

/* Services */


angular.module('homejs.services', ['ngResource']).
    factory('Device', function($resource) {
	return $resource(
	    "/items/:id.json", {id: '@uuid'},
	    {update: {method: "PUT"}}
	);
    });

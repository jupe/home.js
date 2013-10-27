'use strict';

/* Services */
// TODO: Should configure root url for API calls in single config setting
angular.module('homejs.services')
  .factory('eViihde', function($http) {
    return {
      get: function(showdate, channel ){
        
        return $http.get("/api/v0/entertainment/tv/now", {
            params: {
              channel: (channel?channel:0),
              showdate: (showdate?showdate:moment().format("D.M.YYYY")),
              ajax:null
            }
          });
      },
    }
  })
    
  
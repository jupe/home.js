angular.module('homejs.controllers')
  .controller("MenuController",function($scope, $http) {

    $scope.items = [
    {"itemId":1, "title":"Overview", "description":"Overview", href: "#/", "class": "active",
     "sublinks":[
            /*{"title":"Google", "href":"http://google.com/", "target":"_blank"}*/
      ]},
    {"itemId":2, "title":"Charts", "description":"Charts", href: "#/charts",
        "sublinks":[ 
            /*{"title":"Yahoo", "href":"http://yahoo.com/", "target":"_blank" }*/
        ]},
    {"itemId":3, "title":"Devices", "description":"Devices", href: "#/devices",
         "sublinks":[
            /*{"title":"Bing", "href":"http://www.bing.com", "target":"_blank" }*/
         ]},
    {"itemId":4, "title":"Automation", "description":"Automation", href: "#/automations",
         "sublinks":[
             {"title":"Actions", "href":"#/actions"},
             {"title":"Schedules", "href":"#/schedules"}
        ]},
    {"itemId":5, "title":"Events", "description":"Events",href: "#/events",
         "sublinks":[]},
    {"itemId":5, "title":"Admin", "description":"Admin",href: "#/admins",
         "sublinks":[
            {"title":"Users", "href":"#/users"},
            {"title":"Groups", "href":"#/groups"},
            {"title":"Services", "href":"#/services"},
            {"title":"Logs", "href":"#/logs"},
            {"title":"Configurations", "href":"#/admins/configurations"},
         ]},
    {"itemId":6, "title":"Info", "description":"Info",href: "#/info",
         "sublinks":[
            {"title":"github pages", "href":"http://github.com/jupe/home.js", "target":"_blank"},
            {"title":"Report issue", "href":"https://github.com/jupe/home.js/issues/new", "target":"_blank"},
         ]}
    ];
    
    // Defaults
    $scope.sublinks = null;
    $scope.activeItem = null;
    //$scope.showItem = null;

    // Default submenu left padding to 0
    $scope.subLeft = {'padding-left':'0px'};
    
    $scope.mouseOverMenu = function(item,pos) {
      // Move submenu based on position of parent
      $scope.subLeft = {'padding-left':(80 * pos)+'px'};
      $scope.sublinks = item.sublinks;
      //$scope.overItem = 
    }
    $scope.mouseLeaveMenu = function(item,pos) {
      //$scope.activeItem = $scope.activeItem;
      //$scope.sublinks = null;
    }
    /*
     * Set active item and submenu links
     */
    $scope.clickMenu = function(item,pos) {
        // Move submenu based on position of parent
        // $scope.subLeft = {'padding-left':(80 * pos)+'px'};
        // Set activeItem and sublinks to the currectly
        // selected item.
        $scope.items.forEach( function(tem){ tem.class=""; });
        item.class="active"
        
        //item.sublinks.forEach( function(tem){ tem.class=""; });
        //item.sublinks.class="active"
        
        $scope.activeItem = item;
        $scope.sublinks = item.sublinks;
    };
    $scope.hideSubMenu = function(){
      $scope.sublinks = null;
      $scope.activeItem = null;
    }
}); 
// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    templates: '../templates',
    
    'jquery.event.drag' : 'libs/SlickGrid/lib/jquery.event.drag-2.2',
    'jquery.ui.sortable': 'libs/SlickGrid/lib/jquery-ui-1.8.16.custom.min',
    'slickgrid.core'    : 'libs/slickgrid/slick.core',
    'slickgrid.grid'    : 'libs/slickgrid/slick.grid',
    'slickgrid.pager'   : 'libs/slickgrid/controls/slick.pager',
    'slickback'         : 'libs/backbone/slickback.min',
    
    
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});

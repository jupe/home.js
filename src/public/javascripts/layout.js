
var toolbar;

$(function() {

  var loginSuccess = function()
  { 
    toolbar.hide('toolbar_login');
  }
  var loginFail = function(){
    toolbar.show('toolbar_login');
  }
  var loginPopup = function(){
    console.log('login..');
    $().w2form({
      name: 'foo',
      url: '/login',
      style: 'border: 0px; background-color: transparent;',
      formHTML: 
        '<div class="w2ui-page page-0">'+
        '	<div class="w2ui-label">Username:</div>'+
        '	<div class="w2ui-field">'+
        '		<input name="username" type="text" size="15"/>'+
        '	</div>'+
        '	<div class="w2ui-label">Password:</div>'+
        '	<div class="w2ui-field">'+
        '		<input name="password" type="password" size="20"/>'+
        '	</div>'+
        '</div>'+
        '<div class="w2ui-buttons">'+
        '	<input type="button" value="Login" name="login">'+
        '</div>',
      fields: [
        { name: 'username', type: 'text', required: true },
        { name: 'password', type: 'text', required: true },
      ],
      actions: {
        login: function () {
          var obj = this;
          console.log('login..');
          this.save({}, function (data) { 
            if (data.status == 'error') {
              console.log('ERROR: '+ data.message);
              loginFail();
              return;
            }
            obj.clear();
            $('#loginpopup').w2popup('close');
            loginSuccess();
          });
        }
      }
    });
    $().w2popup('open', {
      title   : 'Login',
      id      : 'loginpopup',
      body    : '<div id="form" style="width: 100%; height: 100%;"></div>',
      style   : 'padding: 15px 0px 0px 0px',
      width   : 450,
      height  : 200, 
      onOpen  : function () {
        $('#w2ui-popup #form').w2render('foo');
      }
    });
  
    /*
    $('loginform').w2form({ 
      name  : 'form',
      url   : 'login',
      fields: [
        { name: 'username', type: 'text', required: true },
        { name: 'password',  type: 'text', required: true },
      ],
      actions: {
        reset: function () {
          this.clear();
        },
        save: function () {
          this.save();
        }
      }
    });*/
  }
  var chart = function(){
    window.location.href = '/charts';
  }
  var devList = function(){
  }
  var devTree = function(){
  }
  var toolbarHandler = function(target, param){
    console.log('TARGET: '+target + ' param: '+ param );
    //return;
    switch(target){
        case('toolbar_login'): loginPopup(); break;
        case('toolbar_chart'): chart(); break;
        case('toolbar_devList'): devList(); break;
        case('toolbar_devTree'): devTree(); break;
      
    }
  }
	
  var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
  $('#layout').w2layout({
      name: 'layout',
      panels: [
          { type: 'top',  size: 50, resizable: false, style: pstyle, content: '<div id="toolbar"/>' },
          { type: 'main', style: pstyle, content: '<div id="main" style="width: 640px; height: 400px"/>' },
          { type: 'right', size: 200, resizable: false, style: pstyle, content: '<div id="right"/>'},
          { type: 'bottom', size: 50, resizable: false, style: pstyle, content: '<div id="bottom"/>' }
      ]
  });
  
  toolbar = $('#toolbar').w2toolbar({ 
    name: 'toolbar',
    items: [
      { type: 'button', id: 'toolbar_login', caption: 'Login', img: 'icon-page' },
      { type: 'button', id: 'toolbar_chart', caption: 'Charts', img: 'icon-page' },
      { type: 'menu',   id: 'toolbar_devices', caption: 'Devices', img: 'icon-folder', items: [
        { text: 'List', id: 'toolbar_devList', icon: 'icon-edit' }, 
        { text: 'Tree', id: 'toolbar_devTree', icon: 'icon-search' }, 
        //{ text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
      ]},
      { type: 'menu', id: 'toolbar_automation', caption: 'Automation', img: 'icon-folder', items: [
        { text: 'Actions', id: '', icon: 'icon-page' }, 
        { text: 'Schedules', icon: 'icon-page' }
      ]},
      { type: 'menu', id: 'toolbar_admin', caption: 'Admin', img: 'icon-folder', items: [
        { text: 'App Events', icon: 'icon-page' }, 
        { text: 'Device Events', icon: 'icon-page' },
        { text: 'Configurations', icon: 'icon-page' }
      ]},
    ],
    onClick: toolbarHandler
  });
  if( user ) {
      toolbar.hide('toolbar_login');
  }
  
  //$("#statusbar").statusbar();
    //$('#topmenu').ptMenu();
    //$('#topmenu').jbar();
    /*
    $('#about').click( function(){
        $.pnotify({
            title: 'home.js',
            text: 'Copyright: JVA',
            history: false,
            delay: 2000,
            closer: false,
            closer_hover: false,
            sticker: false,
            
        });
    });*/
});
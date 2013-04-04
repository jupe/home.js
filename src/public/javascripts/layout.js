$(function() {
	//$("#statusbar").statusbar();
    $('#topmenu').ptMenu();
    //$('#topmenu').jbar();
    
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
    });
});
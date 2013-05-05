$(function() {
    var $events = $("#events");
   
    HomeJs.getEvents(null, function(events){
        for(var i=0;i<events.length;i++)
        {            
            var html = '<tr>';
            html += '<td>'+(new moment(events[i].created.timestamp)).format('YY/MM/DD HH:mm')+'</td>';
            html += '<td>'+events[i].type+'</td>';
            html += '<td>'+events[i].msg+'</td>';
            if( events[i].details )
                html += '<td>'+events[i].details+'</td>';
            $('#events').append( html );
        }
    });
    
});
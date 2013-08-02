$(function() {
    
    $.getJSON('/devices/'+uuid+'.json', function(device){
        var json = new JsonUtil();    
        delete device.events;
        $('#show').html( json.tableifyObject(device) );
    });
    
});
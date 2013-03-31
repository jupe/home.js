$(function() {
    var api = CloudApi;
   
    $.getJSON('/actions/'+uuid+'.json', function(details){
        
        $('#details').append('<tr><th>Name</th><td>'+details.name+'</td></tr>');
        $('#details').append('<tr><th>Type</th><td>'+details.type+'</td></tr>');
        $('#details').append('<tr><th>Enable</th><td>'+details.enable+'</td></tr>');
    });
    
});
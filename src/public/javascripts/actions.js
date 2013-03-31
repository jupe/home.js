function enableAction(uuid, enable, callback)
{
    values = {enable: enable }
    $.ajax({
        type: "PUT",
        url: '/actions/'+uuid+'.json',
        contentType : 'application/json',
        data: JSON.stringify(values),
        success: function () {
            callback(null, 1);
        },
        error: function(){
            callback('error');
        }
    });
}
var grid;
$(function() {
    var api = CloudApi;
   
    $.getJSON('/actions.json', function(actions){
        var data = [];
        for(var i=0;i<actions.length;i++)
        {
            data[i] = {
                name: '<a href="/actions/'+actions[i].uuid+'/edit">'+actions[i].name+'</a>',
                createTimestamp: (new moment(actions[i].created.timestamp)).format('YY/MM/DD hh:mm'),
                enable: '<a href="#" enable="'+actions[i].enable+'" class="enabler" uuid="'+actions[i].uuid+'">'+actions[i].enable+'</a>',
                type: actions[i].type,
                lastAction: (new moment(actions[i].lastAction)).format('YY/MM/DD hh:mm'),
              };
        }
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "name", name: "Name", field: "name", formatter: formatter, width: 120, resizable: false, sortable: true },
            {id: "timestamp", name: "Created", field: "createTimestamp", width: 140, resizable: false, sortable: true},
            {id: "enable", name: "Enable", field: "enable", width: 80, formatter: formatter, resizable: false, sortable: true},
            {id: "type", name: "Type", field: "type", width: 100, resizable: false, sortable: true},
            {id: "lastAction", name: "Last Action", field: "lastAction", width: 200, resizable: false, sortable: true},
          ];
        grid = new Slick.Grid("#actions", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
                
              });
        
        $('.enabler').click( function(e){
            var uuid = e.target.attributes.getNamedItem('uuid').value;
            var enable = e.target.attributes.getNamedItem('enable').value=='true';
            
            enableAction(uuid, !enable, function(err, ok){
                if( err ){
                } else {
                    location.reload();
                }
            });
            
        });
    });
    
});
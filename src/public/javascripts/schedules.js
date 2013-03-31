function enableSchedule(uuid, enable, callback)
{
    values = {enable: enable }
    $.ajax({
        type: "PUT",
        url: '/schedules/'+uuid+'.json',
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
   
    $.getJSON('/schedules.json', function(schedules){
        var data = [];
        for(var i=0;i<schedules.length;i++)
        {            
            data[i] = {
                name: '<a href="/schedules/'+schedules[i].uuid+'/edit">'+schedules[i].name+'</a>',
                createTimestamp: (new moment(schedules[i].created.timestamp)).format('YY/MM/DD hh:mm'),
                enable: '<a href="#" enable="'+schedules[i].enable+'" class="enabler" uuid="'+schedules[i].uuid+'">'+schedules[i].enable+'</a>',
                cron: schedules[i].cron,
                actions: '',
                lastTriggered: 'newer'
              };
            for( var j=0;j<schedules[i].actions.length; j++ )
            {
                data[i]['actions'] += '<a href="/actions/'+schedules[i].actions[j]+'">'+schedules[i].actions[j]+'</a>';
            }
            
            if( schedules[i].lastTriggered )
                data[i]['lastTriggered'] = moment( new Date(schedules[i].lastTriggered)).format('YYYY/MM/DD HH:mm');
            
        }
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "name", name: "Name", field: "name", formatter: formatter, width: 120, resizable: false, sortable: true },
            {id: "created", name: "Created", field: "createTimestamp", width: 140, resizable: false, sortable: true},
            {id: "enable", name: "Enable", field: "enable", width: 80, formatter: formatter, resizable: false, sortable: true},
            {id: "cron", name: "Cron", field: "cron", width: 130, resizable: false, sortable: true},
            {id: "actions", name: "Actions", field: "actions", formatter: formatter, width: 200, resizable: false, sortable: true},
            {id: "lastTriggered", name: "Last Triggered", field: "lastTriggered", width: 200, resizable: false, sortable: true},
          ];
        grid = new Slick.Grid("#schedules", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
              });
        
        
        $('.enabler').click( function(e){
            var uuid = e.target.attributes.getNamedItem('uuid').value;
            var enable = e.target.attributes.getNamedItem('enable').value=='true';
            
            enableSchedule(uuid, !enable, function(err, ok){
                if( err ){
                } else {
                    location.reload();
                }
            });
            
        });
    });
    
});

$(function() {
    
    var url = '/devices.json';
    if( typeof(query) == 'object'){
        url +='?';
        $.each(query, function(key, item){
           url +=key+'='+item;
        });
    }
    $.getJSON(url, function(devices){
        var data = [];
        $.each(devices, function(i, device){
            data[i] = {
                name: '<a href="/device/'+device.uuid+'/edit">'+device.name+'</a>',
                createTimestamp: (new moment(device.created.timestamp)).format('YY/MM/DD hh:mm'),
                enable: '<a href="#" enable="'+device.enable+'" class="enabler" uuid="'+device.uuid+'">'+device.enable+'</a>',
                type: device.type,
                protocol: device.protocol,
                lastAction: device.lastAction
              };
            if( device.lastAction )
                data[i]['lastAction'] = moment(new Date(device.lastAction)).format('YYYY/MM/DD HH:mm');
            if( device.ow.lastValue )    
                data[i]['lastValue'] = device.ow.lastValue;
        });
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "name", name: "Name", field: "name", formatter: formatter, width: 160, resizable: false, sortable: true },
            {id: "created", name: "Created", field: "createTimestamp", width: 150, resizable: false, sortable: true},
            {id: "enable", name: "Enable", field: "enable", width: 80, formatter: formatter, resizable: false, sortable: true},
            {id: "type", name: "Type", field: "type", width: 70, resizable: false, sortable: true},
            {id: "protocol", name: "Protocol", field: "protocol", formatter: formatter, width: 100, resizable: false, sortable: true},
            {id: "lastAction", name: "Last Action", field: "lastAction", width: 160, resizable: false, sortable: true},
            {id: "lastValue", name: "Last Value", field: "lastValue", width: 100, resizable: false, sortable: true},
          ];
        grid = new Slick.Grid("#devices", data, columns, {
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
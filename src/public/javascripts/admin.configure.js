function storeConfgs(type, values)
{
    $.ajax({
        type: "PUT",
        url: '/admin/configure/'+type,
        contentType : 'application/json',
        data: JSON.stringify(values),
        success: function () {
            location.reload();
        },
        error: function(){
            alert('failure');
        }
    }); 
}
function upgrade(event){
    $('#upgrade').html('upgrading..');
    $.ajax({
        type: "POST",
        url: '/admin/upgrade',
        contentType : 'application/json',
        data: JSON.stringify({}),
        success: function () {
            $('#upgrade').html('upgrading..ready. Wait a little more for reload app');
            setTimeout( location.reload(), 10000 );
        },
        error: function(msg){
            $('#upgrade').html( 'upgrading..fails! '+JSON.stringify(msg) );
        }
    }); 
}
function reboot(event){
    $('#reboot').html('rebooting..');
    $.ajax({
        type: "POST",
        url: '/admin/reboot',
        contentType : 'application/json',
        data: JSON.stringify({}),
        success: function () {
            $('#reboot').html('reboot success. Wait a minute while rebooting..');
            setTimeout( location.reload(), 60000 );
        },
        error: function(){
            alert('failure');
        }
    }); 
}

$(function() {
    
    $.getJSON('/admin/commit.json', function(commit){
        $('#commit').html( "Current version: "+
            '<a href="https://github.com/jupe/home.js/commit/'+commit.id+'">'+
            "Timestamp: "+moment(new Date(commit.timestamp)).format('YYYY/MM/DD HH:mm')+
            "</a>"
            );
    });
    $.getJSON('/admin/upgrade.json', function(data){
        if( data.uptodate ) {
            $('#upgrade').html('Application is already up to date');
        } else {
            html = '<br><input type="button" title="WARNING! ALL YOUR LOCAL CONFIGURATIONS WILL BE LOST" value="Upgrade now" id="upgradeNow" ="test"/>';
            html += '<a href="'+data.link+'" title="'+data.title+'">There is update available</a>';
            $('#upgrade').html(html);
            
            $('#upgradeNow').button().click( upgrade );
        }
    });
    $('#reboot').button().click( reboot );
    
    $.getJSON('/admin/configure/app.json', function(app){
        var data = [];
        
        data[0] = {
            port: app.port
          };
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "port", name: "Port", field: "port", formatter: formatter, width: 80, resizable: false, editor: Slick.Editors.Integer }
          ];
        grid = new Slick.Grid("#app", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
                editable: true,
              });
        grid.onCellChange.subscribe(function(e,args){
            storeConfgs( 'app', { 
                port: args.item['port'], 
            });
        });
    });
    
    $.getJSON('/admin/configure/email.json', function(email){
        var data = [];
        
        data[0] = {
            host: email.host,
            ssh: email.ssh,
            from: email.from,
            username: email.username,
            password: email.password            
          };
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "host", name: "Host", field: "host", formatter: formatter, width: 200, resizable: false, editor: Slick.Editors.Text },
            {id: "port", name: "Port", field: "port", formatter: formatter, width: 80, resizable: false, editor: Slick.Editors.Integer },
            {id: "from", name: "From", field: "from", formatter: formatter, width: 200, resizable: false, editor: Slick.Editors.Text },
            {id: "ssh", name: "SSH", field: "ssh", width: 60, resizable: false, editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
            {id: "username", name: "Username", field: "username", width: 150, formatter: formatter, resizable: false, editor: Slick.Editors.Text},
            {id: "password", name: "Password", field: "password", width: 150, resizable: false, editor: Slick.Editors.Text},
            
          ];
        grid = new Slick.Grid("#email", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
                editable: true,
              });
        grid.onCellChange.subscribe(function(e,args){
            storeConfgs( 'email', { 
                    host:       args.item['host'], 
                    port:       args.item['port'], 
                    from:       args.item['from'], 
                    ssh:        args.item['ssh'],
                    username:   args.item['username'],
                    password:   args.item['password'] 
                    });
        });
    });
    
    $.getJSON('/admin/configure/owfs.json', function(owfs){
        var data = [];
        
        data[0] = {
            host: owfs.host,
            port: owfs.port,
            enable: owfs.enable,
            simulate: owfs.simulate,
          };
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "host", name: "Host", field: "host", formatter: formatter, width: 200, resizable: false, editor: Slick.Editors.Text },
            {id: "port", name: "Port", field: "port", formatter: formatter, width: 80, resizable: false, editor: Slick.Editors.Integer },
            {id: "enable", name: "Enable", field: "enable", width: 80, resizable: false, editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
            {id: "simulate", name: "Simulate", field: "Simulate", width: 80, formatter: formatter, resizable: false, editor: Slick.Editors.Checkmark},
            
          ];
        grid = new Slick.Grid("#owfs", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
                editable: true,
              });
        grid.onCellChange.subscribe(function(e,args){
            storeConfgs( 'owfs', { 
                    host:       args.item['host'], 
                    port:       args.item['port'], 
                    enable:     args.item['enable'], 
                    simulate:   args.item['simulate']
                    });
        });
    });
    
    $.getJSON('/admin/configure/mongodb.json', function(mongodb){
        var data = [];
        
        data[0] = {
            host: mongodb.host,
            port: mongodb.port,
          };
        
        function formatter(row, cell, value, columnDef, dataContext) {
            return value;
        }
        var columns = [
            {id: "host", name: "Host", field: "host", formatter: formatter, width: 200, resizable: false, editor: Slick.Editors.Text },
            {id: "port", name: "Port", field: "port", formatter: formatter, width: 80, resizable: false, editor: Slick.Editors.Integer },
            
          ];
        grid = new Slick.Grid("#mongodb", data, columns, {
                enableCellNavigation: true,
                enableColumnReorder: false,
                editable: true,
              });
        grid.onCellChange.subscribe(function(e,args){
            storeConfgs( 'mongodb', { 
                    host:       args.item['host'], 
                    port:       args.item['port'], 
                    });
        });
    });
    
});
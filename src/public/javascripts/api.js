var CloudApi = {
    host: "192.168.0.103",
    timestamp: undefined,
    devices: [],
    
    fetchDevices: function(cb){
        $.getJSON("/devices.json", function(data){
            if(data){
                this.timestamp = new Date();
                var list=[];
                $.each(data.rows, function(key, val)
                {
                    list.push( val.doc );
                });
                cb(list);
            } cb(false);
            
        });
     },
     isFresh: function()
     {
        if( this.timestamp == undefined ){
            return false;
        }
        var now = new Date();
        var diff = Math.abs(now-this.timestamp);
        return diff.valueOf() < 10000;
     },
     devicesByProtocol: function(protocol, cb){
        var list = [];
        if( !this.isFresh() ){   
            this.fetchDevices(function(devices){
                this.devices = devices;
                $.each(devices, function(dev){
                    if( dev.protocol == protocol ){
                        list.push(dev);
                    }
                }).bind(this);
                cb(list);
            });
        } else {
            $.each(this.devices, function(dev){
                if( dev.protocol == protocol ){
                    list.push(dev);
                }
            });
            cb(list);
        }
     },
     devicesByType: function(type, cb){
        var list = [];
        if( !this.isFresh() ){  
            this.fetchDevices(function(devices){
                this.devices = devices;
                $.each(devices, function(dev){
                    if( dev.type == type ){
                        list.push(dev);
                    }
                });
                cb(list);
            });
        } else {
            $.each(this.devices, function(dev){
                if( dev.type == type ){
                    list.push(dev);
                }
            });
            cb(list);
        }
    },
};
/*
$(document).ready(function()
{
    var refreshId = setInterval( function()
    {
        fetchDevices();
    }, 5000);
}
*/
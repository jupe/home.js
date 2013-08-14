$(function() {
    
    var api = HomeJs;
    var $genericDialog = $("#genericDialog");
    //api.devicesByProtocol( "zwave", function(devs){} );
    //api.devicesByProtocol( "zwave", function(devs){} );    
    $('#devicesTree').jstree({
        "plugins" : [ "themes", "json_data", "ui", "types","contextmenu","crrm",/*"cookies"*/,"dnd","search"/*,"hotkeys"*/ ],
        types: {
            max_depth: -2,
            max_children: -2,
            "valid_children" : [ "drive" ],
            // Rest omitted
           
            
            /*types: {
                valid_children: ["root"],
                types: {
                    root: {
                        // can have files and folders inside, but NOT other `drive` nodes
                        //"valid_children" : "all",
                        //"icon" : {
                            //"image" : "/static/v.1.0pre/_demo/root.png"
                        //},
                        "max_children"	: -1,
                        "max_depth"		: -1,
                        //"valid_children": ["root", 'ow', 'zwave'],

                        // Bound functions - you can bind any other function here (using boolean or function)
                        "select_node"	: true,
                        "open_node"	    : true,
                        "close_node"	: true,
                        "create_node"	: false,
                        "delete_node"	: false
                    }
                }
            }*/
            "types" : {
                "types" : {
                    "root" : {
                        "icon" : {
                            "image" : "/poc/_docs/printer.png"
                         }
                    }
                }
            },
        },
        json_data: {
            data: [
                {
                    data: "devices",
                    state: "open",
                    attr: {
                        id: "devices",
                        rel: "root",
                    },
                    children: [
                        {
                            data: "by protocols",
                            state: "open",
                            attr: {
                                id: "protocols",
                                rel: 'protocol',
                            },
                            children: [
                                {
                                    data: "ow",
                                    state: "closed",
                                    attr: {
                                        protocol: "ow",
                                        id: "protocol_ow",
                                        rel: 'ow',
                                    },
                                    children: []
                                },{
                                    data: "zwave",
                                    state: "closed",
                                    attr: {
                                        protocol: "zwave",
                                        id: "protocol_zwave",
                                        rel: 'zwave',
                                    },
                                    children: []
                                }
                            ]
                        },
                        {
                            data: "by location",
                            state: "open",
                            attr: {
                                id: "location",
                                rel: 'location',
                            },
                            children: [
                                {
                                    data: "by room",
                                    state: "closed",
                                    attr: {
                                        id: "room",
                                        rel: 'room',
                                    },
                                    children: []
                                }
                            ]
                        },
                        {
                            data: "by types",
                            state: "open",
                            attr: {
                                id: "types",
                            },
                            children: [
                                {
                                    data: "switches",
                                    state: "closed",
                                    attr: {
                                        type: "switches",
                                        id: "type_switch",
                                    },
                                    children: []
                                },
                                {
                                    data: "sensors",
                                    state: "closed",
                                    attr: {
                                        type: "sensors",
                                        id: "type_sensor",
                                    },
                                    children: []
                                },
                                {
                                    data: "meters",
                                    state: "closed",
                                    attr: {
                                        type: "meters",
                                        id: "type_meter",
                                    },
                                    children: []
                                },
                                {
                                    data: "thermostats",
                                    state: "closed",
                                    attr: {
                                        type: "thermostats",
                                        id: "type_thermostat",
                                    },
                                    children: []
                                },
                                {
                                    data: "locks",
                                    state: "closed",
                                    attr: {
                                        type: "locks",
                                        id: "type_lock",
                                    },
                                    children: []
                                },
                                {
                                    data: "cameras",
                                    state: "closed",
                                    attr: {
                                        type: "cameras",
                                        id: "type_cameras",
                                    },
                                    children: []
                                }
                            ]
                        }
                    ],
                }
            ]
        }
        
    }).bind("open_node.jstree", function (event, data) { 
        
        switch( data.rslt.obj.attr("protocol") )
        {
            case("ow"): fetch_devices("ow"); break;
            case("zwave"): fetch_devices("zwave"); break;
            default: break;
        }
        switch( data.rslt.obj.attr("type") )
        {
            case("sensors"): fetch_devices(0, "sensor"); break;
            case("switches"): fetch_devices(0, "switch"); break;
            case("thermostats"): fetch_devices(0, "thermostat"); break;
            case("meters"): fetch_devices(0, "meter"); break;
            case("cameras"): fetch_devices(0, "camera"); break;
            default: break;
        }
    })/*.bind("select_node.jstree", function (node, check, event) {
        var a = $.jstree._focused().get_selected();
        $genericDialog.dialog({
            title: "ASDF",
            modal: true,
            width: 350,
            height: 300,
            buttons: {
                "OK": function() {
                         $genericDialog.dialog("close");
                     }
            }
        });  
        
    })*/.bind('select_node.jstree', function(e,data) { 
        if(  data.rslt.obj.attr("href") != undefined )
            window.location.href = data.rslt.obj.attr("href"); 
    }).bind("remove.jstree", function (e, data) {
		data.rslt.obj.each(function () {
            var uuid = data.rslt.obj.attr("uuid");
            if( uuid )
            {
                $.ajax({
                    async : false,
                    type: 'DELETE',
                    contentType: "application/json",
                    url: "/devices/"+uuid+".json",
                    success : function (r) {
                        if(!r.status) {
                            data.inst.refresh();
                        }
                    }
                });
                return true;
            }   return false;
		});
	})
	.bind("rename.jstree", function (e, data) {
		
        var uuid = data.rslt.obj.attr("uuid");
        if( uuid )
        { $.ajax({
                async : false,
                type: 'PUT',
                contentType: "application/json; charset=utf-8",
                url: "/devices/"+uuid,
                data : JSON.stringify({ name: data.rslt.new_name}), 
                success : function (r) {
                    if(!r.status) {
                        data.inst.refresh();
                    }
                }
            });
            return true;
        } return false;
	})
    function fetch_devices(protocol, type) {
        var url = "/devices.json?";
        if( protocol ){
            url += "protocol="+protocol;
        }else if( type ){
            url += "type="+type;
        }
        $.getJSON(url, function( data){
            //$('#devicesTree').tree('create_node', function()
            $.each(data, function(key, val)
            {
                if( val.protocol == protocol)
                {
                    var node = {
                        data: val.name,
                        //state : null,
                        attr: {
                            href: "/devices/"+val.uuid,
                            id: val.id,
                            uuid: val.uuid,
                            //title: "Last value: "+val.meter.last.value + " "+val.meter.last.unit,
                        }
                    };
                    $('#devicesTree').jstree(
                        "create_node", "#protocol_"+protocol, "inside", node, false, false
                    );
                }
                if( val.type == type)
                {
                    var node = {
                        data: val.name,
                        attr: {
                            href: "/devices/"+val.uuid,
                            id: val.id,
                            uuid: val.uuid,
                            //title: "Last value: "+val.meter.last_value,
                        },
                    };
                    $('#devicesTree').jstree(
                        "create_node", "#type_"+type, "inside", node, false, false
                    );
                }
            });
        });
    }
});
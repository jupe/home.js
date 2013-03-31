/*
function rrdFetch(fname, cb) {
	try {
	  FetchBinaryURLAsync(fname, function(bf) {
		  var i_rrd_data=undefined;
		  try {
			var i_rrd_data=new RRDFile(bf);            
		  } catch(err) {
			cb(err);
		  }
		  if (i_rrd_data!=undefined) {
			cb(null, i_rrd_data);
		  }
	  });
	} catch (err) {
	  cb(err);
	}
}
var flot = null;
function draw_chart(divid, rrddata) {
	if ((rrddata==undefined)) {
	  return; // some data still missing
	}
    rrd_data_sum=new RRDFileSum([rrddata]);
       
	// the rrdFlot object creates and handles the graph
	//var rrdflot_defaults={graph_only:false,use_checked_DSs:true,checked_DSs:['outdoor'],use_rra:true,rra:0,}
	var rrdflot_defaults={ 
		graph_width:"700px", graph_height:"300px", 
		scale_width:"450px", scale_height:"100px", 
		//timezone:"+2",
		//use_elem_buttons: true,
		//use_rra: true,
		//multi_rra: true	
	};
	var graph_opts= {
		legend: { noColumns:4},
		tooltip: true,
		tooltipOpts: { content: "<h4>%s</h4> %x <br>Value: %y.3" }
	};
	var ds_graph_opts={ 
        'W':{ 
            //color: "#ff8000", 
            label: 'energy [W]',
            lines: { show: true, fill: false, fillColor:"#ffff80"},
            //checked: flot?flot.ds_graph_options.outdoor.checked:true
        },
       'kWh':{ 
            label: 'energy [kWh]', color: "#00c0c0", 
            lines: { show: true, fill: false},
            //checked: flot?flot.ds_graph_options.livingroom.checked:true
        }
    };

	// the rrdFlot object creates and handles the graph
	flot=new rrdFlot(divid,rrd_data_sum,graph_opts,ds_graph_opts, rrdflot_defaults);
}
*/

function hoardTime( time )
{
    if( typeof(time) == 'number')
        return Math.floor(time/1000);
    if( time.getTime )
        return Math.floor(time.getTime()/1000);
}
function fetchHoard( uuid, callback )
{
    var url = '/devices/'+uuid+'/events.hoard?';
    url += 'from='+hoardTime((new Date()).getTime() - 1000*60*60*24);
    url += '&to='+hoardTime((new Date()).getTime());
    //1363716900
    //url += '&to='+(new Date()).getTime();
    $.getJSON(url, function(hoard){
        var data = [];
        var stamp = hoard.timeInfo.from;
        var interval = hoard.timeInfo.interval;
        $.each(hoard.values, function(key, value)
        {
            if( value == 'null' )
            {
                data.push( [ stamp, 0 ] );
            } else {
                data.push( [ stamp, value ] );
            }
            stamp += interval;
        });
        callback(data);
    });
}

function fetchHoards( devices, i, flotData, callback )
{
    if( i < devices.length )
    {
        fetchHoard( devices[i].uuid, function(data){
            flotData[ devices[i].name] = { 
                label: devices[i].name +'[C]',
                data: data}
            fetchHoards(devices, i+1, flotData, callback); 
        });
    } else {
        callback( flotData );
    }
}

var gFlotData = {};
function drawChart()
{
    var data = []
    $.each(gFlotData, function(key, dataset)
    {
        data.push(dataset);
    });
    $.plot("#chart", data, {
        xaxis: { 
            mode: "time",
        },
        yaxis: {
            min: -30,
            max: 30
        },
        grid: {
            hoverable: true,
            clickable: true
        },
    });
    
    function showTooltip(x, y, contents) {
        $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y + 5,
            left: x + 5,
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }

    var previousPoint = null;
    $("#chart").bind("plothover", function (event, pos, item) {

        
        //var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
        //$("#hoverdata").text(str);
        
        if (item) {
            if (previousPoint != item.dataIndex) {

                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                y = item.datapoint[1].toFixed(2);

                showTooltip(item.pageX, item.pageY,
                    item.series.label + " of " + moment(new Date(x*1000)).format('YYYY/MM/DD HH:mm') + " = " + y);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
        
    });

    $("#chart").bind("plotclick", function (event, pos, item) {
        if (item) {
            //$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
            plot.highlight(item.series, item.datapoint);
        }
    });
    
}

$(function() {
     $.getJSON("/devices.json", function(data){
        var hoardUuids = [];
        // [[-373597200000, 315.71], [-370918800000, 317.45]]
        $.each(data, function(key, device)
        {
            if( device.type == "meter" )
            {
                if( device.hoard.enable )
                {
                    hoardUuids.push(device);
                }
        
                /*if( val.doc.meter.rrd.href )
                {
                    rrdFetch(val.doc.meter.rrd.href, function(error, data){
                        if(error){
                            //alert("File "+fname+" is not a valid RRD archive!\n"+err);
                        } else {
                            $("#charts").html("RRDfetch success!");
                            draw_chart("charts", data);
                        }
                        
                    });
                }
                */
            }
            fetchHoards( hoardUuids, 0, {}, function(flotData)
            {
                gFlotData = flotData;
                drawChart();
            });
        });
        //$('#debug').append( JSON.stringify(chartData) );
        
        
        
    });
    
    /*
    $("#lastdayninetynine").click(function () {
			$.plot("#charts", [d], {
				xaxis: {
					mode: "time",
					minTickSize: [1, "hour"],
					min: (new Date(1999, 11, 31)).getTime(),
					max: (new Date(2000, 0, 1)).getTime(),
					twelveHourClock: true
				}
			}); 
    });
    */
});
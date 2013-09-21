function hoardTime( time )
{
    if( typeof(time) == 'number')
        return Math.floor(time/1000);
    if( time.getTime )
        return Math.floor(time.getTime()/1000);
}
function fetchHoard( uuid, callback )
{
    function GetSelectedPeriod()
    {
        var from = new Date().getTime()-2*60*60*1000;
        var to = new Date().getTime();
        var selected = $("input[type='radio'][name='period']:checked");
        if (selected.length > 0){
            from = new Date(selected.attr('from')).getTime();
            to = new Date(selected.attr('to')).getTime();
        }
        return {from: from, to: to};
    }
    HomeJs.getDeviceHoard(uuid, GetSelectedPeriod(), function(hoard){
        var data = [];
        var stamp = new Date(hoard.timeInfo.from).getTime();
        var interval = hoard.timeInfo.interval;
        $('#resolution').html(interval/1000+' s');
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
                data: data,
                points: { show: true },
                /*color: "rgb(30, 180, 20)",
                threshold: {
					below: 0,
					color: "rgb(200, 20, 30)"
				},*/
                lines: { show: true/*, fill: true*/ },
                }
            fetchHoards(devices, i+1, flotData, callback); 
        });
    } else {
        callback( flotData );
    }
}

var gFlotData = {};
function drawChart()
{
    var datasets = []
    $.each(gFlotData, function(key, dataset)
    {
        datasets.push(dataset);
    });
    
    var i = 0;
    $.each(datasets, function(key, val) {
        val.color = i;
        ++i;
    });
    
   

    /*
    // insert checkboxes 
    var choiceContainer = $("#choices");
    if(choiceContainer.html() == "" ) {
        $.each(datasets, function(key, val) {
            choiceContainer.append("<br/><input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "'>"
                + val.label + "</label>");
        });
    }

    choiceContainer.find("input").click(plotAccordingToChoices);
    */
    
    function plotAccordingToChoices() {

        var data = [];

        /*
        choiceContainer.find("input:checked").each(function () {
            var key = $(this).attr("name");
            if (key && datasets[key]) {
                data.push(datasets[key]);
            }
        });
        */

        if (datasets.length > 0) {
            $.plot("#chart", datasets, {
                xaxis: { 
                    mode: "time",
                    timezone: "browser"
                },
                yaxis: {
                    //min: -30,
                    //max: 30
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
            });
            var previousPoint = null;
            $("#chart").bind("plothover", function (event, pos, item) {

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
                //var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
                //$("#hoverdata").text(str);
                
                if (item) {
                    if (previousPoint != item.dataIndex) {

                        previousPoint = item.dataIndex;

                        $("#tooltip").remove();
                        var x = parseInt(item.datapoint[0]),
                        y = item.datapoint[1].toFixed(2);

                        showTooltip(item.pageX, item.pageY,
                            item.series.label + " of " + moment(new Date(x)).format('YYYY/MM/DD HH:mm') + " = " + y);
                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;            
                }
                
            });
            
            /*$(".chart-container").resizable({
                maxWidth: 1000,
                maxHeight: 700,
                minWidth: 450,
                minHeight: 250,
            });*/
            $("#chart").bind("plotclick", function (event, pos, item) {
                if (item) {
                    //$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }
    }
    plotAccordingToChoices();
    
}

var charts = {
  clean: function(){
    console.log('Cleaning charts');
  }
}


var hoardUuidCache = [];
$(function() {

     // set new content
    w2ui['layout'].content('main',
      '<div class="chart-container" style="height: 100%; width: 100%">'+
      '  <div id="chart" class="chart-placeholder" style="height: 100%; width: 100%" />'+
      '</div>'
      );
      
    var lastHour = function(hours){
      return new Date(new Date().getTime()-(hours*60*60*1000))
    }
    
    
    w2ui['layout'].content('right', '<div id="sidebar" style="height: 300px; width: 180px;"></div>');
    $('#sidebar').w2sidebar({
      name       : 'sidebar',
      //topHTML    : '<div style="background-color: #eee; padding: 10px 5px; border-bottom: 1px solid silver">Conf</div>',
      //bottomHTML : '<div style="background-color: #eee; padding: 10px 5px; border-top: 1px solid silver">Conf</div>',
      nodes : [ 
        { id: 'level-1', text: 'Period', img: 'icon-folder', expanded: true, group: true,
          nodes: [ { id: 'level-1-1', from: lastHour(6), text: 'Last 6h', img: 'icon-page' },
               { id: 'level-1-2', text: 'Last day', img: 'icon-page' },
               { id: 'level-1-3', text: 'Last week', img: 'icon-page' },
               { id: 'level-1-4', text: 'Last month', img: 'icon-page' },
               { id: 'level-1-5', text: 'Last 6 month', img: 'icon-page' },
               { id: 'level-1-6', text: 'Last Year', img: 'icon-page' }
             ]
        },
        { id: 'level-2', text: 'Devices', img: 'icon-folder', group: true,
          nodes: [ 
               { id: 'level-2-1', text: 'Level 2.1', img: 'icon-page' },
               { id: 'level-2-2', text: 'Level 2.2', img: 'icon-page' },
               { id: 'level-2-3', text: 'Level 2.3', img: 'icon-page' }
             ]
        },
      ],
      onClick: function (target, data) {
        console.log('Target: '+ target);
      }
    });
    
      /*'<center>'+
      '<br/>'+
      '<label for="last6h">Last 6h</label>'+
      '<input type="radio" class="period" id="last6h" name="period" from="'+lastHour(6)+' to='+lastHour(0)+'checked="checked"></input>'+
      '<br/>'+
      '<label for="last24h">Last day</label>'+
      '<input type="radio" class="period"  id="last24h"  name="period" from="'+lastHour(24)+' to='+lastHour(0)+'></input>'+
      '<br/>'+
      '<label for="lastWeek">Last Week</label>'+
      '<input type="radio" class="period" id="lastWeek" name="period" from="'+lastHour(24*7)+' to='+lastHour(0)+'></input>'+
      '<br/>'+
      '//label(for="today")="Today"'+
      '<input(type="radio", class="period", id="today", title="Today", name="period", from=new Date(new Date().getTime()-(24*60*60*1000)), to=new Date())'+
      '//label(for="today")="Today"'+
      '<input(type="radio", class="period", id="week",  title="Week",  name="period", from=new Date(new Date().getTime()-(7*24*60*60*1000)), to=new Date())'+
      '//label(for="week")="Week"'+
      '<input(type="radio", class="period", id="month", title="Month", name="period", from=new Date(new Date().getTime()-(30*24*60*60*1000)), to=new Date())'+
      '//label(for="month")="Month"'+
      '<input(type="radio", class="period", id="year", title="Year", name="period", from=new Date(new Date().getTime()-(360*24*60*60*1000)), to=new Date())'+
      '<input(type="radio", class="period", id="twoyear", title="Two Year", name="period", from=new Date(new Date().getTime()-(2*365*24*60*60*1000)), to=new Date())'+
      '<input(type="radio", class="period", id="threeyear", title="Three Years", name="period", from=new Date(new Date().getTime()-(3*365*24*60*60*1000)), to=new Date())'+
      '//label(for="year")Year</label>'+
      '<div#resolution>'
      '</center>'
    );*/
    
      
    $('.period').change( function(){
        fetchHoards( hoardUuidCache, 0, {}, function(flotData)
        {
            gFlotData = flotData;
            drawChart();
        });
    });
    HomeJs.getDevices(false, function(data){
        
        // [[-373597200000, 315.71], [-370918800000, 317.45]]
        $.each(data, function(key, device)
        {
            if( device.type == "meter" )
            {
                if( device.hoard.enable )
                {
                    hoardUuidCache.push(device);
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
        });
        
        fetchHoards( hoardUuidCache, 0, {}, function(flotData)
        {
            gFlotData = flotData;
            drawChart();
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
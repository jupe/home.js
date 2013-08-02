$(function() {
    var api = CloudApi;
    var $events = $("#events");
    /*
    var grid;
    var loader = new Slick.Data.RemoteModel();

    var storyTitleFormatter = function (row, cell, value, columnDef, dataContext) {
      return "<b><a href='" + dataContext["link"] + "' target=_blank>" +
            dataContext["title"] + "</a></b><br/>" + dataContext["description"];
    };
    
     var columns = [
        {id: "num", name: "#", field: "index", width: 40},
        {id: "story", name: "Story", width: 580, formatter: storyTitleFormatter, cssClass: "cell-story"},
        {id: "diggs", name: "Diggs", field: "diggs", width: 60, sortable: true}
      ];

      var options = {
        rowHeight: 64,
        editable: false,
        enableAddRow: false,
        enableCellNavigation: false
      };

      var loadingIndicator = null;
    
     grid = new Slick.Grid("#myGrid", loader.data, columns, options);
*/
    $.getJSON('/devices.json', function(devices){
        for(var i=0;i<devices.length;i++)
        {
            $.getJSON('/devices/'+devices[i].uuid+'.json', function( data ){
                
                    for(var j=0;j<data.events.length;j++)
                    {
                        var html = '<tr>';
                        html += '<td>'+(new moment(data.events[j].created.timestamp)).format('YY/MM/DD hh:mm')+'</td>';
                        html += '<td>'+data.name+'</td>';
                        html += '<td>'+data.type+'</td>';
                        html += '<td>'+data.events[j].values[0].value+data.events[j].values[0].unit+'</td>';
                        $('#events').append( html );
                    }
            });
        }
    });
    
});
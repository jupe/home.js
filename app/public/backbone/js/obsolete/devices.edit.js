$(function() {
    
    $.getJSON('/devices/'+uuid+'.json', function(device){
        $('#showForm').jsonForm({
            schema: {
              name: { type: 'string', title: 'Name', required: true },
              enable: { type: 'boolean', title: 'Enable' },
              type: {type: 'string', enum: ['switch', 'sensor', 'meter', 'thermostat', 'camera'], title: 'Type'},
              location: {type: 'object', title: 'Location', properties:{
                room: {type: 'string', title: 'Room'}
              }}
            },
            value: device,
            onSubmit: function (errors, values) {
              if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
              }
              else {
                 $.ajax({
                    type: "PUT",
                    url: '/devices/'+uuid+'.json',
                    contentType : 'application/json',
                    data: JSON.stringify(values),
                    success: function () {
                        $('#res').html('<p>Saved</p>');
                    },
                    error: function(){
                        alert('failure');
                    }
                });
              }
            }
        });
    });
    
});
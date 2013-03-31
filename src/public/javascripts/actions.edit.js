$(function() {

    

    $.getJSON('/actions/'+uuid+'.json', function(schedule){
        var schema = {
            name:   { type: 'string', title: 'Name', required: true },
            enable:   { type: 'boolean', title: 'Enable' },
            script:   { type: 'string', title: 'Script' }
        }
        $('#action').jsonForm({
            schema: schema,
            form: [
                { key: 'name' },
                { key: 'enable' },
                { key: 'script',  type: 'ace' },
                { type: 'submit', title: 'save' }
            ],
            value: schedule,
            onSubmit: function (errors, values) {
              if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
              }
              else {
                if( !values.enable ) values['enable'] = false;
                 $.ajax({
                    type: "PUT",
                    url: '/actions/'+uuid+'.json',
                    contentType : 'application/json',
                    data: JSON.stringify(values),
                    success: function () {
                        $('#res').html('<p>Saved</p>');
                        window.location = '/actions/'+uuid
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
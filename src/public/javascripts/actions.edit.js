$(function() {

    

    HomeJs.getAction(uuid, function(schedule){
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
                HomeJs.saveAction(uuid, valuse, function(error, ok)
                {
                  if( error ) alert('failure: '+error);
                  else {
                    $('#res').html('<p>Saved</p>');
                    window.location = '/actions/'+uuid
                  }
                });
              }
            }
        });
    });

});
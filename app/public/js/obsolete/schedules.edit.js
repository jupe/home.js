$(function() {

    var schema = {
      name:   { type: 'string', title: 'Name', required: true },
      enable:  { type: 'boolean', title: 'Enable'},
      cron:    { type: 'string', default: '* * * * * *', title: 'Cron'},
      actions: { type: 'array', title: 'Actions', items: {
        type: 'string', enum: ['']
      }}
    }
    HomeJs.getActions(false, function(actions){
        for(var i=0;i<actions.length;i++){
            schema.actions.items.enum.push(actions[i].uuid);
        }
        HomeJs.getSchedule(uuid, function(schedule){
            $('#schedule').jsonForm({
                schema: schema,
                value: schedule,
                onSubmit: function (errors, values) {
                  if (errors) {
                    $('#res').html('<p>I beg your pardon?</p>');
                  }
                  else {
                    if( !values.enable ) values['enable'] = false;
                    
                    var len = values.cron.split(' ').length;
                    if( len != 6 && len != 5 ){
                        alert('invalid crons');
                        return;
                    }
                    HomeJs.saveSchedule(uuid, values, function(error, ok){
                      if(error) alert('failure');
                      else {
                        $('#res').html('<p>Saved</p>');
                            setTimeout(function(){
                                //window.location = '/schedules/';
                            }, 2000);
                      }
                    });
                    
                  }
                }
            });
        });
    });
});
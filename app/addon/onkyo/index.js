var Onkyo;
var OnkyoAddon = function(app) {
  var onkyo;
  function Init(app){
    onkyo = new Onkyo();
    onkyo.on("error", onError);
    onkyo.on("detected", onDetected);
    onkyo.on("connected", onConnected);
    
    app.get('/api/v0/addon/onkyo/group', group);
    app.get('/api/v0/addon/onkyo/group/:group', group);
    app.put('/api/v0/addon/onkyo/:group/:command', command);
    
    app.put('/api/v0/addon/onkyo/discover', discover);
    
    app.put('/api/v0/addon/onkyo/power/:state', power);
    app.put('/api/v0/addon/onkyo/volume/:state', volume);
    
    app.put('/api/v0/entertainment/audio/power/:state', power);
    app.put('/api/v0/entertainment/audio/volume/:state', volume);
    
    //discover now
    //discoverNow();
    
  }
  function onError(err){
    console.error(err);
  }
  function onDetected(device){
    console.error(device);
  }
  function onConnected(host){
    console.error("connected to: "+JSON.stringify(host));
  }
  
  function group(req, res){
    res.json( onkyo.GetGroup(req.params.group) );
  }
  function discoverNow(callback){
    onkyo.Discover( function(err, device){
      onkyo.Connect( function(){
        if(callback)callback(device);
      });
    });
  }
  
  function discover(req, res){
    discoverNow( function(device){
      res.json(device);
    })
  }
  function power(req, res){
    if( req.params.state == 'on'){
      onkyo.PwrOn( function(error, ok){
        res.json(ok);
      });
    } else if( req.params.state == 'off'){
      onkyo.PwrOff(function(error, ok){
        res.json(ok);
      });
    } else {
      res.json(404, {error: 'command not supported'});
    }
  }
  function command(req, res){
    onkyo.SendCommand(
      req.params.group, 
      req.params.command, 
      function(error, resp){
        if(error) res.json(500, {error: error});
        else if(resp) res.json(resp);
        else res.json({});
    }); 
  }
  function volume(req, res){
    var cmd = '';
    switch( req.params.state ){
      case('up'): cmd= 'Volume Up'; break;
      case('down'): cmd= 'Volume Down'; break;
      case('mute'): cmd= 'Mute'; break;
      case('unmute'): cmd= 'UnMute'; break;
      default:  
        res.json(404, {error: 'command not supported'});
        return;
    }
    if(!onkyo.SendCommand('AUDIO', cmd, function(error, ok){
      res.json(ok);
    })){
      res.json(500, {error: 'command failed'});
    }
     
  }
  
  Init(app);
  
  return this;
}
try{
  Onkyo = require('onkyo.js');
} catch(e){
  console.error(e);
  console.log('onkyo is disabled');
  OnkyoAddon.disable = true;
}
module.exports = OnkyoAddon;

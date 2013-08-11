/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
*/

//RRD = require('rrd').RRD;

//var Db = require("./database");
//db = new Db();

/*
Will be moved to services folder
var Zw = require("./api_zwave");
var zw = new Zw();
*/

/*
exports.index = function(req, res){
  console.log('resource index');
  console.log(req.params);
  db.getDevicesByType( "meter", function(err, meters) {
        if(err) console.log(err);
        console.log(meters);
        
        switch( req.params.format )
        {
            case(undefined):
            case('html'):
                res.render("meters", {
                    meters: meters, user: req.session.user
                });
                break;
            case('json'):
                res.json( meters );
                break;
        }
   });
};

exports.new = function(req, res){
  console.log('new resource');
  console.log(req.params);
  res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function(req, res){
    console.log('create sensor resource');
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    if( ["zwave", "ow"].indexOf(req.body.protocol) == -1 )
    {
        console.log("Protocol not supported!");
        res.send(501, "protocol not supported"); //Not Implemented
        return;
    } else if ( ["sensor", "meter"].indexOf(req.body.type) == -1) {
        console.log("tried to create sensor without sensor type!");
        res.send(501, "protocol not supported"); //Not Implemented
        return;
    } else if( ["energy", "temperature"].indexOf(req.body.meter.type) == -1 )
    {
        console.log("tried to create sensor without valid type!");
        res.send(501, "sensor type not supported"); //Not Implemented
        return;
    }
    if( req.body.meter.last.unit == undefined ||
       req.body.meter.last.unit == "undefined" )
   {
        console.log("tried to create sensor without valid type!");
        res.send(200, "sensor unit not supported"); //Not Implemented
        return;
   }
       

  db.getDeviceById( req.body._id, function(error, data)
  {
    if( error )
    { 
        console.log("insert new sensor to db");
        console.log(error);
        var rrdurl = '/rrds/'+req.body._id+'.rrd';
        var newData = req.body;
        newData.meter.rrd = { href: rrdurl};
        
        if( req.body.meter.type == "energy" )
        {
            rrd = new RRD("./public/"+rrdurl);
            rrd.create( ["DS:W:GAUGE:600:U:U", 
                         "DS:kWh:GAUGE:600:U:U", 
                         "RRA:AVERAGE:0.5:1:12",
                         "RRA:AVERAGE:0.5:1:288",
                         "RRA:AVERAGE:0.5:12:168",
                         "RRA:AVERAGE:0.5:12:720",
                         "RRA:AVERAGE:0.5:288:365",
                        ], {}, function(err)
            {
                if(err)console.log(err);
                else {
                    var cmd = "-t "+req.body.meter.last.unit+" N:"+ req.body.meter.last.value;
                    console.log(cmd);
                    rrd.rrdExec( "update",  cmd, function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("update success");
                    });
                };
            });
        }
        else if( req.body.meter.type == "temperature" )
        {
            rrd = new RRD("./public/"+rrdurl);
            rrd.create( ["DS:temperature:GAUGE:600:U:U", 
                         "RRA:AVERAGE:0.5:1:12",
                         "RRA:AVERAGE:0.5:1:288",
                         "RRA:AVERAGE:0.5:12:168",
                         "RRA:AVERAGE:0.5:12:720",
                         "RRA:AVERAGE:0.5:288:365",
                        ], {}, function(err)
            {
                if(err)console.log(err);
                else 
                {
                    var cmd = "-t "+req.body.meter.last.unit+" N:"+ req.body.meter.last.value;
                    console.log(cmd);
                    rrd.rrdExec( "update",  cmd, function(err){
                        if(err){
                            console.log(err);
                        }
                        else console.log("update success");
                    });
                }
            });
        }
        
        //Finally create mew Data
        db.newDevice(newData, function(error, data){
            if(error) res.json(error);
            else {
                res.json(data);
            }
        }); 
    } else {
        
        console.log("insert sensor data to rrd");
        console.log(data);
        
        data.meter["last"] = {};
        data.meter.last.value = req.body.meter.last.value;
        data.meter.last['timestamp'] = new Date();
        data.meter.last['unit'] = req.body.meter.last.unit;
        
        
        data.meter[ req.body.meter.last.unit ] = {};
        data.meter[ req.body.meter.last.unit ]['last'] = {}
        data.meter[ req.body.meter.last.unit ].last['value'] = req.body.meter.last.value;
        data.meter[ req.body.meter.last.unit ].last['timestamp'] = new Date();
        
        db.newDevice(data, function(error, data){
            if(error) console.log(error);
            else {
                console.log("saved to db");
            }
        }); 
        
        res.send(200);
        rrd = new RRD('./public/rrds/'+req.body._id+'.rrd');
        console.log(req.body.meter);
        var cmd = "-t "+req.body.meter.last.unit+" N:"+ req.body.meter.last.value;
        console.log(cmd);
        rrd.rrdExec( "update", cmd, function(err){
            if(err){
                console.log(err);
            }
            else console.log("rrd update success");
        });
    } 
  });
};

exports.show = function(req, res){
  console.log('show resource sensor');
  console.log(req.params);
  
  db.getDeviceById( req.body.sensor, function(error, sensor)
  {
    if( error )
    {
        console.log(error);
        res.render(501); //Not Implemented
    } else {
        console.log(sensor);
        var rrd = './public/rrds/'+req.body._id+'.rrd';
        switch( req.params.format )
        {
            case(undefined):
            case('html'):
                res.render("sensor_show", {
                    sensor: sensor,
                    rrd: rrd
                });
                break;
            case('json'):
                res.json( sensor );
                break;
        }
    }
  });
  
};

exports.edit = function(req, res){
  console.log('edit resource ');
  console.log(req.params);
  res.render(501); //Not Implemented
};

exports.update = function(req, res){
  console.log('update forum ');
  console.log(req.params);
  res.render(501); //Not Implemented
};

exports.destroy = function(req, res){
  console.log('destroy resource ');
  console.log(req.params);
  res.render(501); //Not Implemented
};
*/
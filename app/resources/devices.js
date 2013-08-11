/*
GET     /items              ->  index
GET     /items/new          ->  new
POST    /items              ->  create
GET     /items/:item       ->  show
GET     /items/:item/edit  ->  edit
PUT     /items/:item       ->  update
DELETE  /items/:item       ->  destroy
 */

var hoard = require("hoard");
var fs = require("fs");

function event(uuid, type, msg, details){
    var data = {
        msg: msg, details: '', type: type,
        source: { component: 'device', uuid: uuid }
    }
    
    if(details) data.details = details;
    db.events.create( data, function(){});
}

exports.index = function (req, res) {
	console.log('resource index');
	switch (req.params.format) {
        case (undefined):
        case ('html'):
            //res.render('devices', {});
            res.render('devices', {query: req.query, user: req.session.user}); //Not Implemented
            break;
        case ('json'):
            console.log("get json devices");
            db.device.find(req.query, function (error, results) {
                if (error) {
                    console.log(error);
                    res.send(500, error);
                } else {
                    console.log(results.length);
                    res.json(results);
                }
            });
            break;
        default:
            res.render(501, {user: req.session.user}); //Not Implemented
            break;
	}
};
exports.tree = function (req, res) {
    res.render('devices.tree.jade', {user: req.session.user});
}
exports.status = function (req, res) {
    res.render(501, {user: req.session.user});
}
exports.new = function (req, res) {
	console.log('new resource');
	console.log(req.params);
	res.render(501, {user: req.session.user}); //Not Implemented
};

exports.create = function (req, res) {
	console.log('create device');
	console.log(req.params);
	console.log(req.body);
	db.device.create(req.body, function (error, device) {
		if (error) {
            console.log("oooo");
            console.log(error);
            res.send(500, error);
        }
		else if (device) {
            if( req.body.hoard )
            {
                var filename = './hoards/'+device.uuid+'.hoard';
                
                console.log("Hoard: ");
                console.log(req.body.hoard);
                var archives = req.body.hoard.archives;
                var period = req.body.hoard.period;
                try {
                hoard.create(filename, archives, period, function(err) {
                    if (err){
                        console.log(err);
                        event(device.uuid, 'error', "Can't create hoard file", err)
                    } else {
                        db.devices.update( { uuid: device.uuid}, 
                                           { 'hoard.file': filename }, function(){} );
                        console.log('Hoard file created!');
                        
                    }
                });
                }catch(e){
                    event(device.uuid, 'error', "Hoard throw error", e)
                }
                
            }
            res.json(device);
        }
		else {
            res.send(500);
        }
	});
};

exports.show = function (req, res, next) {
	console.log('show device');
	console.log(req.params);
    //console.log(db.devices);
	switch (req.params.format) {
        case (undefined):
        case ('html'):
            res.render('devices.show.jade', {uuid: req.params.device, user: req.session.user});
            break;
        case ('json'):
            console.log("get json devices");
            db.device.findOne({uuid: req.params.device}, function (error, results) {
                if (error) {
                    console.log(err);
                    res.json(err);
                } else if(results) {
                    var obj = results.toObject();
                    db.devices.events.find( {device: results.uuid}, function(error, events){
                        obj['events'] = events;
                        res.json(obj);
                    });
                } else {
                    console.log("NotFound");
                    res.send(404);
                    //next();
                }
            });
            break;
        default:
            res.render(501, {user: req.session.user}); //Not Implemented
            break;
	}
};
exports.events = function(req,res)
{
    console.log("Device events");
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    switch (req.params.format) {
        case (undefined):
        case ('html'):
            res.render('devices.events.jade', {user: req.session.user});
            break;
        case ('json'):
            db.device.events.find( { uuid: req.params.device}, function(error, events){
                res.json(events);
            });
            break;
        case ('hoard'):
            console.log('get hoard');
            
            db.device.findOne( {uuid: req.params.device}, function(error, device){
                if( error ) { 
                    res.send(500, error);
                } else if( device ) {
                    //console.log(device.hoard);
                    if( device.hoard.file && fs.existsSync( device.hoard.file ) ){
                        var from = unixTime()-60*60*24, //default: "last 1h"
                            to = unixTime();
                        if( req.query.from ){
                            from = parseInt(req.query.from)/1000;
                        } else if( req.body.from ) {
                            from = parseInt(req.body.from)/1000;
                        }
                        if( req.query.to ){
                            to = parseInt(req.query.to)/1000;
                        } else if( req.body.to ) {
                            to = parseInt(req.body.to)/1000;
                        }
                        //console.log( new Date(from*1000) );
                        //console.log( new Date(to*1000) );
                        hoard.fetch(device.hoard.file, from, to, 
                            function(err, timeInfo, values) {
                            if (err) {
                                console.log(err);
                                res.send(500, err);
                            } else {
                                console.log( timeInfo );
                                console.log( new Date(timeInfo[0]*1000) );
                                res.json( { timeInfo: {from: new Date(timeInfo[0]*1000), to: new Date(timeInfo[1]*1000), interval: timeInfo[2]*1000}, values: values });
                            }
                        });
                    } else {
                        res.send(500, "Hoard file not found!");
                    }
                } else {
                    res.send(404);
                }
            });
            
            break;
        default:
            res.render(501, {user: req.session.user}); //Not Implemented
            break;
	}
}
function unixTime(date) {
  if( date ) return parseInt(date.getTime() / 1000);
  return parseInt(new Date().getTime() / 1000);
};
function pushToHoard(filename, values, cb )
{
    if( filename && fs.existsSync( filename ) )
    {   console.log('hoard file exists and will be update');
        hoard.updateMany(filename, values, cb);
    } else cb("File "+filename+" not exists!");
}
exports.newEvent = function(req,res)
{
    console.log("Device events");
    var conditions = {uuid: req.params.device};
    if( req.params.device[2] == '.' )
        //var stateOWid = /^[0-9A-Fa-f]{2}.[0-9A-Fa-f]{12}/
        //if (stateOWid.test(owid)) {
        conditions = {protocol: 'ow', id: req.params.device}
        
    db.device.findOne(conditions, function(error, device){
        if( error ){
            console.log(error);
            res.send(500, error);
        } else if(device){
            var event = req.body;
            db.device.update( {uuid: device.uuid}, {'lastAction': new Date()}, function(e,d){} );
            if( event.type == 'hoard' && device.hoard.enable)
            {   console.log('hoard data coming..');
                try {
                //[ [t,v] ]
                console.log(event.values);
                db.device.update( {uuid: device.uuid}, {'ow.lastValue': event.values[0][1]}, function(e,d){} );
                
                //var stamp = unixTime();
                
                pushToHoard(device.hoard.file, event.values, function(err) {
                    if (err) {
                        console.log("hoard error");
                        console.log('err: '+err);
                        event(req.params.device, 'error', "Can't update hoard file", err)
                    } else {
                        console.log('Hoard file updated!');
                    }
                });
                } catch( e ){
                    //event(device.uuid, 'error', "hoard throw error", e)
                    console.log(e);
                }
            } else {
                event['device'] = device.uuid;
                db.device.events.create( event, function(error, event){
                    if (error) {
                        console.log(error);
                        res.send(500, error);
                    }
                    else if (event) {res.json(event);}
                    else {res.send(404);}
                });
            }
        } else{
            res.send(404);
        }
    });
}
exports.edit = function (req, res) {
	console.log('edit resource ');
	console.log(req.params);
	res.render('devices.edit.jade', {uuid: req.params.device, user: req.session.user});
}

exports.update = function (req, res) {
	console.log('update device '+req.params.device);
	console.log(req.body);
    if( req.body.event )
    {
        var json = req.body.event;
        json['device'] = req.params.device;
        db.device.events.create( json, function(error, ok){    
            if (error) {
                console.log(error);
                res.send(500, error);
            }
            else if (ok) {res.send(200);}
            else {res.send(500);}
        });
    } else
    {
        db.device.update( {uuid: req.params.device}, req.body, function(error, ok){    
            if (error) {
                console.log(error);
                res.send(500, error);
            }
            else if (ok) {res.json(ok);}
            else {res.send(500);}
        });
    } 
};

exports.destroy = function (req, res) {
	console.log('destroy resource ');
	console.log(req.params);
    db.device.events.remove( {uuid: req.params.device}, function(error, ok){});
	db.device.remove( {uuid: req.params.device}, function(error, ok){    
        if (error) {
            console.log(error);
            res.send(500, error);
        }
		else if (ok) {res.send(200);}
		else {res.send(404);}
    });
};

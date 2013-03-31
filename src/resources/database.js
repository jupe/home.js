var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var db;

var Device = new Schema({
    uuid : {type: String, index: true}, 
    name  :  { type: String },
    id    :  { type: String, index: true, unique: true },
    enable: {type: Boolean, default: true},
    ow: {
        FamilyCode: {type: String, max_length: 2},
        id: {type: String},
        crc: {type: String},
        lastValue: {type: Number},
    },
    hoard: {
        enable: {type: Boolean },
        file: {type: String },
        archives: {type: Object},
        period: {type: Number}
    },
    protocol  :  { type: String, enum: ['ow', 'zwave'], index: true, required: true }, 
    type: { type: String, enum: ['switch', 'sensor', 'meter', 'thermostat', 'camera']},
    created :  {
        timestamp: { type: Date, default: Date.now },
        user: {type: String}
    },
    lastAction: { type: Date, default: Date.now },
    location: {
        room: {type: String},
        geo: {type: [Number], index: '2d'},
        map: {type: [Number], index: '2d', index: true},
    }
}).pre('save', function (next) 
{
  if( this.isNew )
    this.uuid = uuid.v1();
  
  if( this.protocol == "ow" )
  {
    if( this.id && this.id.length!= 15 ){
        //28.C7DC7A030000
        console.log("ow id lenght (%i)!= 15 !", this.id.length);
        next( new Error("invalid id") );
        return;
        
    } else {
        this.ow.FamilyCode = this.id.substr(0,2);
        this.ow.id = this.id.substr(3,10);
        this.ow.crc = this.id.substr(11,2);
        if( !this.name){
            this.name = this.id;
        }
    }
  }
  next();
 
});
var DeviceEvent = new Schema({
    uuid : {type: String}, 
    device :  { type: String, required: true },
    type: {type: String, enum: ['measure', 'alert'], required: true, default: 'measure'},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    values: [{
        unit: { type: String, enum: ['W', 'kWh', 'C', 'V','A'], required: true },
        value: {type: Number, required: true}
    }],
}).pre('save', function (next) {
  
  if( this.type == 'measure' && this.values.length == 0 )
  {
    err = new Error("There is no any values!");
    next(err);
    return;
  }
  if( this.isNew ){
    this.uuid = uuid.v1();
  }
  next(); 
});
var Event = new Schema({
    uuid : {type: String},
    type  :  { type: String, default: 'general', enum: ['general', 'fatal', 'error', 'warn', 'info'] },
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    source: {
        component: {type: String, enum: ['device', 'rule', 'action', 'schedule', 'group', 'user', 'service'] },
        uuid: { type: String },
        name: { type: String }
    }, 
    msg: {type: String, required: true},
    details: {type: String}
}).pre('save', function (next) {
   if( this.isNew )
    this.uuid = uuid.v1();
   next();
});
var Group = new Schema({
    name: {type: String},
    users: [ {type: String} ]
});
var User = new Schema({
    uuid : {type: String, index: true},
    name: {type: String, unique: true, index: true},
    email: {type: String, unique: true, index: true},
    password: {type: String }
}).pre('save', function(next){
    function validateEmail (val) {
      return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val);
    }
    if( this.isNew )
     this.uuid = uuid.v1();
    if( this.email )
     if( !this.validateEmail(this.email) )
        next(new Error('Invalid email address'));
    
    next();
});
var RuleCondition = new Schema({
    before: {
        delay: {type: Number, default: 0}
    },
    script: {type: String }, //
    after: {
        delay: {type: Number, default: 0}
    }
});
var RuleAction = new Schema({
    action: {type: String}, //Action uuid
});
var Rule = new Schema({
    uuid : {type: String, index: true},
    name  :  { type: String, required: true },
    created: {
        user: {type: String},
        timestamp: {type: Date, default: Date.now}
    },
    modified: {
        user: {type: String},
        timestamp: {type: Date, default: Date.now}
    },
    device :  { type: String },
    conditions: [ RuleCondition ],
    actions: [RuleAction]
}).pre('save', function (next) {
   if( this.isNew )
    this.uuid = uuid.v1();
   next();
});
var Action = new Schema({
    uuid : {type: String, unique: true, index: true},
    enable: {type: Boolean, default: true},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    lastAction: {type: Date, default: Date.now},
    type: {type: String, enum: ['script'], default: 'script'},
    name:  { type: String },
    description:  { type: String },
    script: {type: String }, //
}).pre('save', function (next) {
   if( this.isNew && this.uuid!='0' )
    this.uuid = uuid.v1();
   next();
});
var Schedule = new Schema({ 
    uuid : {type: String,  unique: true, index: true},
    enable: {type: Boolean, default: false},
    created: {
        timestamp: {type: Date, default: Date.now},
    },
    lastTriggered: {type: Date},
    name  :  { type: String, unique: true },
    description:  { type: String },
    cron: {type: String, default: '0 0 * * * *'}, //for cron-parser
    preAction: {type: String},
    actions: [ {type: String} ],
    postAction: {type: String},
}).pre('save', function (next) {
   if( this.isNew && this.uuid!='0' ) 
    this.uuid = uuid.v1();
   next();
});
Schedule.path('cron').validate(function (value, respond) {
  var len = value.split(' ').length;
  respond( len == 6 || len == 5 ); //simple validation for cron
}, 'Invalid cron format. Valid format is for e.g. "*/22 * * * * *" {second (optional), minute, hour, dayOfMonth, month, dayOfWeek}');

var Configure = new Schema({ 
    name: {type: String, unique: true, index: true},
    host: {type: String},
    enable: {type: Boolean},
    simulate: {type: Boolean},
    ssh: {type: Boolean},
    username: {type: String},
    password: {type: String},
    port: {type: Number, default: 4304},
});

// Constructor
function Db(cfg) {
   if(!cfg) cfg = require('../config.json').mongodb;
   //host = 'mongodb://localhost/nodeHomeAutomation';
   this.db = mongoose.createConnection(cfg.host, cfg.database, cfg.port, cfg.opts);
   this.db.on('error', function(){
     console.error("Failed to connect mongodb");
   });
   this.devicesModel = this.db.model('devices', Device);
   this.rulesModel =  this.db.model('rules', Rule);
   this.actionModel = this.db.model('actions', Action);
   this.scheduleModel =  this.db.model('schedules', Schedule);  
   this.deviceEventsModel =  this.db.model('device.events', DeviceEvent); 
   this.eventModel =  this.db.model('events', Event); 

   
   this.configureModel =  this.db.model('configures', Configure);  
   //this.owfsModel =  this.db.model('configures', owfs);  
   
   //User.plugin(require('basic-auth-mongoose'));
   this.userModel =  this.db.model('users', User);  
   this.groupModel =  this.db.model('groups', Group);  
   
   this.userModel.create( { name: 'admin' }, function(e,o){} );
   
   
   this.configureModel.create( {name: 'email', 
                                  from: "no-reply@gmail.com",
                                  host: "smtp.kolumbus.fi",
                                  ssh: false, 
                                  username: '',
                                  password: ''
                                  }, function(e,d){});
    this.configureModel.create( { name: 'owfs', 
                                  host: "localhost",
                                  port: 4304,
                                  simulate: true
                                  }, function(e,d){});                                  
   
   //this.actionModel.create( {uuid: '0', name: 'test', script: 'console.log("test")'}, function(e,d){}); 
   //this.scheduleModel.create( { uuid: '0', enable: true, name: 'scheduler updater', actions: ['0'], cron: '*/10 * * * *' }, function(e,d){});
   /*
   var data = {
      uuid: '0',
      enable: true,
      name: 'scheduler updater',
      cron: '0 * * * *'
   }
   this.schedulersModel.create(data
   //this.eventModel.create(data
   , function(error,data){});
   */
   
   db = this; 
}
Db.prototype.info = function( cb) {
    // should get { couchdb: "Welcome", version: "1.0.1" }
    // if something went wrong, the `err` argument would provide the error that CouchDB provides
    this.server.info(cb);
}
// class methods
Db.prototype.users = {
    create: function(data, cb){
        db.userModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.userModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.userModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.userModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.userModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.userModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.userModel.remove(conditions, cb);
    },
}
Db.prototype.groups = {
    create: function(data, cb){
        db.groupModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.groupModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.groupModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.groupModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.groupModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.groupModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.groupModel.remove(conditions, cb);
    },
}
Db.prototype.configures = {
    email: {
        get: function(cb){
            db.configureModel.findOne({name: 'email'}, cb);
        },
        update: function(update, cb){
            db.configureModel.update({name: 'email'}, update, cb);
        }
    },
    owfs: {
        get: function(cb){
            db.configureModel.findOne({name: 'owfs'}, cb);
        },
        update: function(update, cb){
            db.configureModel.update({name: 'owfs'}, update, cb);
        }
    }
}
Db.prototype.events = {
    create: function(data, cb){
        db.eventModel.create(data, cb);
    },
    find: function(conditions, cb) {
        //db.eventModel.find(conditions, cb);
        db.eventModel.find(conditions).sort({ 'created.timestamp': -1 }).execFind(cb);
    },
    findOne: function(conditions, cb){
        db.eventModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.eventModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.eventModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.eventModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.eventModel.remove(conditions, cb);
    },
}
Db.prototype.devices = {
    info: function(cb){
        db.devicesModel.info(cb);
    },
    create: function(data, cb){
        db.devicesModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.devicesModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.devicesModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.devicesModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.devicesModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.devicesModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.devicesModel.remove(conditions, cb);
    },
    events: {
        info: function(cb){
            db.deviceEventsModel.info(cb);
        },
        create: function(data, cb){
            db.deviceEventsModel.create(data, cb);
        },
        find: function(conditions, cb) {
            db.deviceEventsModel.find(conditions).sort({'created.timestamp':-1}).execFind(cb);
        },
        findOne: function(conditions, cb){
            db.deviceEventsModel.findOne(conditions, cb);
        },
        distinct: function(conditions, conditions, cb){
            db.deviceEventsModel.distinct(conditions, cb);
        },
        update: function(conditions, update,  cb){
            db.deviceEventsModel.update(conditions, update, cb);
        },
        count: function(conditions, cb){
            db.deviceEventsModel.count(conditions, cb);
        },
        remove: function(conditions, cb){
            db.deviceEventsModel.remove(conditions, cb);
        },
    }
}
Db.prototype.rules = {
    create: function(data, cb){
        db.rulesModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.rulesModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.rulesModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.rulesModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.rulesModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.rulesModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.rulesModel.remove(conditions, cb);
    },
}
Db.prototype.actions = {
    create: function(data, cb){
        db.actionModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.actionModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.actionModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.actionModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        update['lastAction'] = new Date();
        db.actionModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.actionModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.actionModel.remove(conditions, cb);
    },
}
Db.prototype.schedules = {
    create: function(data, cb){
        db.scheduleModel.create(data, cb);
    },
    find: function(conditions, cb) {
        db.scheduleModel.find(conditions, cb);
    },
    findOne: function(conditions, cb){
        db.scheduleModel.findOne(conditions, cb);
    },
    distinct: function(conditions, conditions, cb){
        db.scheduleModel.distinct(conditions, cb);
    },
    update: function(conditions, update, cb){
        db.scheduleModel.update(conditions, update, cb);
    },
    count: function(conditions, cb){
        db.scheduleModel.count(conditions, cb);
    },
    remove: function(conditions, cb){
        db.scheduleModel.remove(conditions, cb);
    },
}


// export the class
module.exports = Db;
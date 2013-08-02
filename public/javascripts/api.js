/*var getJSON = function(url, data, callback)
{
  if( typeof(data) == 'function')
  {
    callback = data;
    data = '';
  } else if( typeof(data) == 'object') {
    data = JSON.stringify(data);
  }
  function setHeader(xhr) {
    xhr.setRequestHeader('Accept-Encoding', 'gzip');
  }
  $.ajax({
          url: url,
          type: 'GET',
          dataType: 'application/json; charset=utf-8',
          data: data,
          success: callback,
          beforeSend: setHeader
        });
}*/

var HomeJs = {
    host: "192.168.0.103",
    timestamp: new Date(),
    Cache: {devices: [] },
    
    putJSON: function(url, json, callback)
    {
      $.ajax({
        type: "PUT",
        url: url,
        contentType : 'application/json',
        data: JSON.stringify(json),
        success: function () {
            callback(null, 1);
        },
        error: function(){
            callback('error');
        }
      });
    },
    
    enableAction: function(uuid, enable, callback)
    {
      HomeJs.putJSON('/actions/'+uuid+'.json', {enable: enable }, callback);
    },
    getAction: function(uuid, callback)
    {
      $.getJSON('/actions/'+uuid+'.json', callback);
    },
    saveAction: function(uuid, action, callback)
    {
      HomeJs.putJSON('/actions/'+uuid+'/', action, callback);
    },
    getActions: function(filters, callback)
    {
      $.getJSON('/actions.json', callback);
    },
    
    
    enableSchedule: function(uuid, enable, callback)
    {
      HomeJs.putJSON('/schedules/'+uuid+'.json', {enable: enable }, callback);
    },
    getSchedule: function(uuid, callback)
    {
      $.getJSON('/schedules/'+uuid+'.json', callback);
    },
    saveSchedule: function(uuid, action, callback)
    {
      HomeJs.putJSON('/schedules/'+uuid+'/', action, callback);
    },
    getSchedules: function(filters, callback)
    {
      $.getJSON('/schedules.json', callback);
    },
    
    
    getEvents: function(filters, callback)
    {
      $.getJSON('/events.json', callback);
    },
    
    getDevices: function(query, cb){
        var url = "/devices.json";
        if( typeof(query) == 'object'){
          url +='?';
          $.each(query, function(key, item){
             url +=key+'='+item;
          });
        }
        $.getJSON(url, function(data){
            cb(data);
            if(data){
                HomeJs.Cache.devices = data;
            }
        });
     },
     
     getDeviceHoard: function(uuid, period, callback)
     {
      var url = '/devices/'+uuid+'/events.hoard?';
      url += 'from='+period.from;
      url += '&to='+period.to;
      $.getJSON(url, callback);
     },
     
     isFresh: function()
     {
        if( this.timestamp == undefined ){
            return false;
        }
        var now = new Date();
        var diff = Math.abs(now-this.timestamp);
        return diff.valueOf() < 10000;
     },
     devicesByProtocol: function(protocol, cb){
        var list = [];
        if( !this.isFresh() ){   
            this.fetchDevices(function(devices){
                this.devices = devices;
                $.each(devices, function(dev){
                    if( dev.protocol == protocol ){
                        list.push(dev);
                    }
                }).bind(this);
                cb(list);
            });
        } else {
            $.each(this.devices, function(dev){
                if( dev.protocol == protocol ){
                    list.push(dev);
                }
            });
            cb(list);
        }
     },
     devicesByType: function(type, cb){
        var list = [];
        if( !this.isFresh() ){  
            this.fetchDevices(function(devices){
                this.devices = devices;
                $.each(devices, function(dev){
                    if( dev.type == type ){
                        list.push(dev);
                    }
                });
                cb(list);
            });
        } else {
            $.each(this.devices, function(dev){
                if( dev.type == type ){
                    list.push(dev);
                }
            });
            cb(list);
        }
    },
};
/*
$(document).ready(function()
{
  
  var refreshId = setInterval( function()
  {
      fetchDevices();
  }, 5000);
}
*/
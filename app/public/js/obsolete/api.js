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
    
    /* JSON HTTP METHDOS POST, PUT, DELETE*/
    postJSON: function(url, json, callback){
        $.ajax({  
          url: url,  
          type: "POST",
          dataType: "json",
          contentType: "application/json",  
          data: JSON.stringify(json),  
          success: function(data, textStatus, xhr){              
            callback(null, data);
          },  
          error: function(xhr, status, error){  
            try{ data = JSON.parse(xhr.responseText);
              callback(data);
            } catch(e){
              callback(xhr.responseText);
            }
          }  
        });
    },
    putJSON: function(url, json, callback){
        $.ajax({  
          url: url,  
          type: "PUT",
          dataType: "json",
          contentType: "application/json",  
          data: JSON.stringify(json),  
          success: function(data){              
            callback(null, data);
          },  
          error: function(xhr, status, error){  
            callback(status);
          }  
        });
    },
    getJSON: function(url, callback){
        $.ajax({  
          url: url,  
          type: "GET",
          contentType: "application/json",
          success: function(data){              
            callback(null, data);
          },  
          error: function(xhr, status, error){  
            var msg = error;
            try {
              msg = JSON.parse( xhr.responseText);
            }catch (e){}
            callback(msg.message);
          }  
        });
    },
    deleteJSON: function(url, json, callback){
        $.ajax({  
          url: url,  
          type: "DELETE",
          contentType: "application/json",  
          data: JSON.stringify(json),  
          success: function(data){              
            callback(null, data);
          },  
          error: function(xhr, status, error){  
            callback(xhr.responseText);
          }  
        });
    },
    
    login: function(uname, pwd, cb){
      HomeJs.postJSON( '/login', {username: uname, password: pwd}, cb);
    },
    logout: function(cb){
      HomeJs.getJSON( '/logout', cb);
    },
    
    enableAction: function(uuid, enable, callback)
    {
      HomeJs.putJSON('/action/'+uuid+'.json', {enable: enable }, callback);
    },
    getAction: function(uuid, callback)
    {
      $.getJSON('/action/'+uuid+'.json', callback);
    },
    saveAction: function(uuid, action, callback)
    {
      HomeJs.putJSON('/action/'+uuid+'/', action, callback);
    },
    getActions: function(filters, callback)
    {
      $.getJSON('/action.json', callback);
    },
    
    
    enableSchedule: function(uuid, enable, callback)
    {
      HomeJs.putJSON('/schedule/'+uuid+'.json', {enable: enable }, callback);
    },
    getSchedule: function(uuid, callback)
    {
      $.getJSON('/schedule/'+uuid+'.json', callback);
    },
    saveSchedule: function(uuid, action, callback)
    {
      HomeJs.putJSON('/schedule/'+uuid+'/', action, callback);
    },
    getSchedules: function(filters, callback)
    {
      $.getJSON('/schedule.json', callback);
    },
    
    
    getEvents: function(filters, callback)
    {
      $.getJSON('/event.json', callback);
    },
    
    getDevices: function(query, cb){
        var url = "/device.json";
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
      var url = '/device/'+uuid+'/events.hoard?';
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
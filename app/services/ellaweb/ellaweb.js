var fs = require('fs');
var path = require('path');
var request = require('request');
var csvjs = require('csv-json');

var Ellaweb = function(cfg){
  var apiurl = 'https://ellaweb.ouka.fi/online'
  var options = cfg;
  
  var doUrl = function(oper){
    switch(oper){
      case('login'): return apiurl+'/cui_login.php';
      case('stat'): return apiurl+'/templates/stat/openCommonExcel.php';
      default: return false;
    }
  }
  var Headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Connection': 'keep-alive',
    'Cache-Control':'max-age=0',
    'Accept-Language':'en-US,en;q=0.8'
  }
                
  
  var parseData = function(csvdata, cb){
    //console.log(csvdata);
    csvdata = csvdata.split('\n');
    csvdata = csvdata.slice(4, csvdata.length);
    csvdata = csvdata.join('\n').trim();
    csvdata = '"date";"sum";"day";"night";"temp"\n'+csvdata
    // ;Päivä;Yhteensä (kWh);PV (kWh);Yö (kWh);Ulkolämpötila (C)
    csvjs.parseCsv( csvdata, { 
      rules: {
          //Rules:
          'date': {path: 'date', convert: function(value){
            var arr = value.match(/([0-9]{1,2}).([0-9]{1,2})/);
            if(arr && arr.length == 3){
              return (new Date( 2013, parseInt(arr[2]), parseInt(arr[1]))).getTime();
            } return value;
          }},
          'sum': {path: 'sum', convert: function(value){
            return parseFloat(value);
          }},
          'day': {path: 'day', convert: function(value){
            return parseFloat(value);
          }},
          'night': {path: 'night', convert: function(value){
            return parseFloat(value);
          }},
          'temp': {path: 'temp', convert: function(value){
            return parseFloat(value);
          }}
      },
      options: { //Options:
        delimiter : ';'
      }},
      cb
      
    );
  }
  
  var Login = function(usr, pwd, cb){
    var url = doUrl('login');
    var formdata = {
      login: 1,
      page_id: 1,
      passwd: pwd,
      trans_query_string: 4,
      username: usr
    };
    request( {
      url: url, 
      method: 'POST',
      headers: Headers,
      form: formdata
    }, function(error, response, body){
      if(error){
        cb( error );
      }
      else if(response.statusCode == 302 ){
        console.log(body);
       cb( null, 1);
      } else {
        cb( response.statusCode );
      }
    });
  }
  
  var Stat = function(cb){
    var url = doUrl('stat');
    var formdata = {
      'page_id':15,
      'domain_id':1,
      'mode':'reportTool',
      'month':'',
      'month2':'',
      'day':'',
      'day2':'',
      'year1':2013,
      'year2':'',
      'timeperiod':1,
      'place':options.place,
      'reportinformation':1,
      'freetext':false,
      'sComponentQuantity':'ENERGY',
      'nCustomerID': options.nCustomerID,
      'sCompanyCode':'OE',
      'nUsagePlaceID':options.place,
      'sProductInterfaceName':'AIKA',
      'sahko_type':''
    };
    request( {
      url: url, 
      method: 'POST',
      headers: Headers,
      form: formdata
    }, function(error, response, body){
      if(error){
        cb( error );
      }
      else if(response.statusCode == 200 ){
        parseData(body, cb);
      } else {
        cb(response.statusCode);
      }
    });
  }
  var Options = function(opt) {
    options = opt;
  }
  /*var testdata = fs.readFileSync('./temp.csv').toString();
  parseData(testdata, function(error, data, stat){
    console.log(error);
    console.log(stat);
    console.log(data);
  });*/
  
  return {
    Login: Login,
    Stat: Stat,
    Options: Options
  }
}
module.exports = Ellaweb;
/*
// TEST 
var api = Ellab();

var username = '';
var password = ''

// no login needed!?
//api.Login(username, password, function(error, ok){
  api.Stat({
        place: 0,
        nCustomerID: 0
    }, function(error, data, stat){
    console.log(data);
  });
//});
*/


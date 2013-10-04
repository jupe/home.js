[home.js](http://jupe.github.io/home.js/)
=======

*IN PROGRESS!*

[![Build Status](https://travis-ci.org/jupe/home.js.png?branch=master)](https://travis-ci.org/jupe/home.js)
[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.1.0/dist/gittip.png)](https://www.gittip.com/jupe/)
[![endorse](https://api.coderwall.com/jupe/endorsecount.png)](https://coderwall.com/jupe)


# Overview

General (home) automation framework based on node.js and mongoDB. 

The aim is to provide a general framework for home/build automation that can be used for example to control the lights on when the motion detector can see the movement.

* [Discussion group](http://groups.google.com/group/node-home-automation)

## Features (planned)
 * Upgrade directly from web UI
 * Users and groups + authentication
 * node.js based server with flexible db (mongoDB)
 * HTTP RESTful API
 * single-page front-end (really fast)
 * schedules scripts
 * action scripts
 * Email alerts (e.g. if temperature goes over limits)
 * Supported hardware:
  * onewire     (owfs/etc)
  * RESOLV VBus (heating system measurement)...
  * zwave (zwave.me/etc)
  * remote reading of electricity
  * Onkyo Receiver
  * ...

## Installation

See [INSTALL](https://github.com/jupe/home.js/blob/master/INSTALL.md) file.

## Dependencies
* [nodejs](www.nodejs.org)
* [mongodb](mongodb.org)
* [owfs](www.owfs.org)  (will be optional dependency)
 * limitations: owfs support only Linux.
  * I've thinking to start using some other onewire library


## Used node modules
 * [express](http://expressjs.com/)
 * [express-resource](https://github.com/visionmedia/express-resource)
 * [mongoose](http://mongoosejs.com/)
 * [uuid](https://github.com/broofa/node-uuid)
 * [owfs](https://npmjs.org/package/owf)
 * [emailjs](https://npmjs.org/package/emailjs)
 * [cron](https://npmjs.org/package/cron)
 * [hoard](https://github.com/cgbystrom/hoard)
 * [winston](https://npmjs.org/package/winston)
 * [keypress](https://npmjs.org/package/keypress)
 * [optimist](https://npmjs.org/package/optimist)
 * [daemonize2](https://npmjs.org/package/daemonize2)
 * [mongoose-query](https://npmjs.org/package/mongoose-query)


## Front-end libraries
 * [Angularjs](http://www.angularjs.org)
 * [jsonform](https://github.com/joshfire/jsonform)
 * [flot](http://www.flotcharts.org/)
 * ...

## Test

API Tested against node.js versions

| 0.10      | 0.8      | 0.6 | 
|  --- | --- |--- |

## HW requirements

 * Supported OS: Linux/partially windows
 * Supported HW: Raspberry Pi & x86 based systems
 

# API

HTTP API /api/v0

## REST Collections  

 * user [HTTP] /user
  * User collection
 * group [HTTP] /group
  * User groups
 * event  [HTTP] /event
  * System events
 * action [HTTP] /action
  * Action scripts
 * schedule [HTTP] /schedule
  * CRON schedules
 * device [HTTP] /device
  * device metadata
 * device.event [HTTP] /device/:device/event  || /device/event
  * device events
 * device.data [HTTP] /device/:device/data  || /device/data
  * Measure data
 * rules [HTTP] /device/:device/rule  || /device/rule
  * Immediately rules when data received. If rule(s) match, start execute action(s)
  
  
### Query parameters:

[q=<query>][&c=true][&f=<fields>][&fo=true][&s=<order>][&sk=<skip>][&l=<limit>]
q=<query> - restrict results by the specified JSON query
c=true - return the result count for this query
f=<set of fields> - specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
fo=true - return a single document from the result set (same as findOne() using the mongo shell
s=<sort order> - specify the order in which to sort each specified field (1- ascending; -1 - descending)
p=<set of fields> - specify the set of fields to populate in each document
sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
l=<limit> - specify the limit for the number of results (default is 1000)
    
  
##  
 
## To do
- [x] basic test steps against API
- [ ] nice GUI - work in progress
- [ ] more functionality - work in progress
- [ ] plugin functionality

## Contributors

* [Jussi Vatjus-Anttila](jva)

## License

Released under the MIT License.
See [LICENSE](https://github.com/jupe/home.js/blob/master/LICENSE) file.

Copyright © 2013 by Jussi Vatjus-Anttila.

* IN PROGRESS! *

[home.js](http://jupe.github.io/home.js/)
=======

General (home) automation framework based on node.js and mongoDB. 

The aim is to provide a framework for home automation that can be used for example to control the lights on when the motion detector can see the movement. At first version will support onewire for get temperatures and then purpose is to get also zwave support.

## Test

Tested against node.js versions: 

| 0.10      | 0.8      | 0.6 | 
|  --- | --- |--- |

[![Build Status](https://travis-ci.org/jupe/home.js.png?branch=master)](https://travis-ci.org/jupe/home.js)

 * Supported OS: Linux/partially windows
 * Supported HW: Raspberry Pi & x86 based systems

* [Discussion group](http://groups.google.com/group/node-home-automation)

## Features
Some of thease might be under develop
 * Upgrade application directly from web UI
 * node.js based server with flexible db (mongodb)
 * HTTP html/json RESTful API
 * onewire
 * zwave (not implemented yet)
 * schedules scripts ([cron](https://npmjs.org/package/cron))
 * action scripts
 * Email alerts (e.g. if temperature goes over limits)

## Installation

See [INSTALL](https://github.com/jupe/home.js/blob/master/INSTALL.md) file.

## Dependencies
* [nodejs](www.nodejs.org)
* [mongodb](mongodb.org)
* [owfs](www.owfs.org)  (will be optional dependency)
 * limitations: owfs support only linux.
  * I've thinking to start using some other onewire library


## Used node modules
 * [express](http://expressjs.com/)
 * [express-resource](https://github.com/visionmedia/express-resource)
 * [jade](http://jade-lang.com/)
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


## Front-end libraries
 * [jsTree](http://www.jstree.com)
 * [jsonform](https://github.com/joshfire/jsonform)
 * [flot](http://www.flotcharts.org/)
 * [w2ui](http://w2ui.com/)
 * ...

## todo
- [x] Reorganize folder structure
- [x] basic test steps against API
- [ ] nice GUI
- [ ] 

## Contributors

* [Jussi Vatjus-Anttila][jva]

## License


Released under the MIT License

See [LICENSE](https://github.com/jupe/home.js/blob/master/LICENSE) file.

Copyright (c) 2013 Jussi Vatjus-Anttila

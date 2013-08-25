* IN PROGRESS! *

[home.js](http://jupe.github.io/home.js/)
=======

[![Build Status](https://travis-ci.org/jupe/home.js.png?branch=master)](https://travis-ci.org/jupe/home.js)

* auto-gen TOC:
{:toc}

# Overview

General (home) automation framework based on node.js and mongoDB. 

The aim is to provide a framework for home automation that can be used for example to control the lights on when the motion detector can see the movement. At first version will support onewire for get temperatures and then purpose is to get also zwave support.

* [Discussion group](http://groups.google.com/group/node-home-automation)

## Features (planned)
 * Upgrade directly from web UI
 * node.js based server with flexible db (mongodb)
 * HTTP RESTful API
 * single-page front-end (really fast)
 * schedules scripts
 * action scripts
 * Email alerts (e.g. if temperature goes over limits) 
 * Supported hardware:
  * onewire
  * zwave
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
 * [Backbone](http://www.backbonejs.org)
 * [requirejs](http://www.requirejs.org)
 * [w2ui](http://w2ui.com/)
 * [jsTree](http://www.jstree.com)
 * [jsonform](https://github.com/joshfire/jsonform)
 * [flot](http://www.flotcharts.org/)
 * ...

## Test

Tested against node.js versions: 

| 0.10      | 0.8      | 0.6 | 
|  --- | --- |--- |

## HW requirements

 * Supported OS: Linux/partially windows
 * Supported HW: Raspberry Pi & x86 based systems 
 
## To do
- [x] Reorganize folder structure
- [x] basic test steps against API
- [.] nice GUI
- [.] more functionality 

## Contributors

* [Jussi Vatjus-Anttila](jva)

## License

Released under the MIT License.
See [LICENSE](https://github.com/jupe/home.js/blob/master/LICENSE) file.

Copyright © 2013 by Jussi Vatjus-Anttila.

home.js
=======

General home automation framework based on node.js and mongodb. First supported protocols will be onewire (owfs) and zwave

[![Build Status](https://travis-ci.org/jupe/home.js.png?branch=w2ui)](https://travis-ci.org/jupe/home.js)

 * Supported OS: Linux/partially windows
 * Supported HW: Raspberry Pi & x86 based systems

![Device Tree](https://raw.github.com/wiki/jupe/home.js/screenshots/chart.summary.png)
![Device Tree](https://raw.github.com/wiki/jupe/home.js/screenshots/configure.png)
![Device Tree](https://raw.github.com/wiki/jupe/home.js/screenshots/devices.png)
![Device Tree](https://raw.github.com/wiki/jupe/home.js/screenshots/devices_tree.png)
![SW Architecture](https://raw.github.com/wiki/jupe/home.js/homejs.png)

* [Slides](https://docs.google.com/presentation/d/170iVTeOct5t582AydG844MueAhtyf9o6j5V6DbciLRM/edit?usp=sharing)
* [Discussion group](http://groups.google.com/group/node-home-automatino)

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

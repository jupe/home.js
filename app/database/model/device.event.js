var mongoose = require('mongoose');
var schema = require('./../schema/device.event');
var model = mongoose.model('device.event', schema);

module.exports = model;
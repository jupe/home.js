var mongoose = require('mongoose');
var schema = require('./../schema/device.data');
var model = mongoose.model('device.data', schema);

module.exports = model;
var mongoose = require('mongoose');
var schema = require('./../schema/device');
var model = mongoose.model('device', schema);

module.exports = model;
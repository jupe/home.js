var mongoose = require('mongoose');
var schema = require('./../schema/schedule');
var model = mongoose.model('schedule', schema);

module.exports = model;
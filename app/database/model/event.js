var mongoose = require('mongoose');
var schema = require('./../schema/event');
var model = mongoose.model('event', schema);

module.exports = model;
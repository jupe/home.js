var mongoose = require('mongoose');
var schema = require('./../schema/service');
var model = mongoose.model('service', schema);

module.exports = model;
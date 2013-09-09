var mongoose = require('mongoose');
var schema = require('./../schema/addon');
var model = mongoose.model('addon', schema);

module.exports = model;
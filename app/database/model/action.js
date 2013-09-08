var mongoose = require('mongoose');
var schema = require('./../schema/action');
var model = mongoose.model('action', schema);

module.exports = model;
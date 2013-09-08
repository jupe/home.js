var mongoose = require('mongoose');
var schema = require('./../schema/rule');
var model = mongoose.model('rule', schema);

module.exports = model;
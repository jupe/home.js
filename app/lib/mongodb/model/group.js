var mongoose = require('mongoose');
var schema = require('./../schema/group');
var model = mongoose.model('group', schema);

module.exports = model;
var mongoose = require('mongoose');
var schema = require('./../schema/user');
var model = mongoose.model('user', schema);

module.exports = model;
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Schema = mongoose.Schema;

var Group = new Schema({
    name: {type: String},
    users: [ {type: String} ]
});

module.exports = Group;
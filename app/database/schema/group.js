var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Group = new Schema({
    name: {type: String, unique: true, required: true, index: true},
    users: [ {type: String} ]
});

module.exports = Group;
/* node.js modules */

/* 3rd party libraries */
var mongoose = require('mongoose');

/* own libraries */  

/* Implementation */ 
var Schema = mongoose.Schema;

//Mongo functions
Mongo = function(collection, schema) 
{
    this.collection = collection;
    this.schema = schema;
    this.model = mongoose.model(collection, schema);
}
Mongo.prototype.jsonform = function(cb)
{
    return this.model.jsonform();
}
Mongo.prototype.store = function(obj, callback) {
    var newObj = new this.model(obj);
    newObj.save( callback );
}
Mongo.prototype.findOne = function(condition, callback){
   this.model.findOne(condition, callback);
}
Mongo.prototype.findOneAndUpdate = function(condition, update, callback){
   this.model.findOneAndUpdate(condition, update, callback);
}
Mongo.prototype.find = function(condition, sorts, skips, limits, select, callback){
  if( !callback && !select && !limits && !skips ) {
    this.model.find(condition, sorts);
  } else {
    this.model.find(condition).select(select).sort(sorts).skip(skips).limit(limits).execFind(callback);
  }
}
Mongo.prototype.jsQuery = function(q, callback){
  this.model.find(q.condition).select(q.select).sort(q.sort).skip(q.skip).limit(q.limit).execFind(callback);
}
Mongo.prototype.populate = function(condition, populate, callback){
  this.model.find(condition).populate(populate).execFind(callback);
}
Mongo.prototype.dataTable = function(query, options, callback)
{
  this.model.dataTable(query, options, callback);
}
Mongo.prototype.query = function(query, callback){
  var q = new qParser(query).get();
  this.model.find(q.conditions).select(q.select).sort(q.sorts).skip(q.skips).limit(q.limit).execFind(callback);
}
Mongo.prototype.findByUuid = function(uuid, callback){
    this.model.findOne( {uuid: uuid},callback);
}
Mongo.prototype.distinct = function(field, condition, callback){
  this.model.distinct(field, condition, callback);
}
Mongo.prototype.update = function(condition, update, callback){
    this.model.update( condition, update, callback);    
}
Mongo.prototype.updateByUuid = function(uuid, update, callback){
    this.model.update( {uuid: uuid}, update, callback);    
}
Mongo.prototype.getModel = function() { return this.model; }
Mongo.prototype.getSchema = function() { return this.model.schema; }
Mongo.prototype.count = function(condition, callback ) {
    this.model.count(condition, callback);
}
Mongo.prototype.removeByUuid = function(uuid, callback ) {
    this.model.remove({uuid: uuid}, callback );
}
Mongo.prototype.remove = function(condition, callback ) {
    this.model.remove(condition, callback );
}
Mongo.prototype.findOneAndRemove = function(condition, callback ) {
    this.model.findOneAndRemove(condition, callback );
}
Mongo.prototype.getIndexes = function( callback ){
  this.model.collection.getIndexes( callback);
}
Mongo.prototype.reIndex = function( callback ){
  this.model.collection.reIndex( callback );
}
Mongo.prototype.runCommand = function( cmd, callback ){
  //var tcmodel = db.model('testcases', TestCaseSchema);
  //db.db.executeDbCommand( cmd, callback);
  callback('not supported');
}
module.exports = Mongo;
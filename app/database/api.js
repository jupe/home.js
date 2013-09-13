/* node.js modules */

/* 3rd party libraries */
var mongoose = require('mongoose');

/* own libraries */  
var Query = require('mongoose-query');

/* Implementation */ 
var Schema = mongoose.Schema;

//Mongo functions
var Mongo = function(collection, schema) 
{
  var self = this;
  var schema = schema;
  var model = mongoose.model(collection, schema);

  
  var Init = function(){
    //register schema static functions
    var keys = Object.keys(model);
    keys.forEach(function(element, key, _array){
      if( typeof(model[element]) == 'function'){
        self[element] = model[element];
      }
    });/*
    //register default mongoose functions
    // this not working correctly --> map manually
    keys = Object.keys(model.base.Model);
    keys.forEach(function(element, key, _array){
      if( typeof(model.base.Model[element]) == 'function'){
        self[element] = model.base.Model[element];
      }
    });*/
  }
  Init();
  
  this.findOne = function(condition, callback){
     model.findOne(condition, callback);
  }
  this.findOneAndUpdate = function(condition, update, callback){
     model.findOneAndUpdate(condition, update, callback);
  }
  this.findAndModify = function(condition, update, callback ) {
    model.findAndModify(condition, update, callback );
  }
  this.distinct = function(field, condition, callback){
    model.distinct(field, condition, callback);
  }
  this.update = function(condition, update, callback){
    model.update( condition, update, callback);    
  }
  this.count = function(condition, callback ) {
     model.count(condition, callback);
  }
  this.remove = function(condition, callback ) {
     model.remove(condition, callback );
  }
  this.findOneAndRemove = function(condition, callback ) {
    model.findOneAndRemove(condition, callback );
  }
  this.jsonform = function(cb)
  {
    cb(this.model.jsonform());
    return this.model.jsonform();
  }
  this.store = function(obj, callback) {
    if( callback ) model.create(obj, callback);
    else model.create(obj, function(){});
  }
  this.find = function(condition, sorts, skips, limits, select, callback){
    if( !callback && !select && !limits && !skips ) {
      model.find(condition, sorts);
    } else {
      model.find(condition).select(select).sort(sorts).skip(skips).limit(limits).execFind(callback);
    }
  }
  this.findOrCreate = function(condition, obj, callback){
    model.findOne(condition, function(error, doc){
      if( error ) callback(error);
      else if(doc){ 
        callback(null, doc);
      } else {
        model.create(obj, function(error, doc){
          //doc.isNew = true; //abnormal valu
          callback(error, doc, true);
        });
      }
    });
  }
  this.jsQuery = function(q, callback){
    model.find(q.condition).select(q.select).sort(q.sort).skip(q.skip).limit(q.limit).execFind(callback);
  }
  this.populate = function(condition, populate, callback){
    model.find(condition).populate(populate).execFind(callback);
  }
  this.query = function(query, callback){
    Query(query, model, callback);
  }
  this.findByUuid = function(uuid, callback){
     model.findOne( {uuid: uuid},callback);
  }
  this.updateByUuid = function(uuid, update, callback){
    model.update( {uuid: uuid}, update, callback);    
  }
  this.removeByUuid = function(uuid, callback ) {
    model.remove({uuid: uuid}, callback );
  }
  this.getIndexes = function( callback ){
     model.collection.getIndexes( callback);
  }
  this.reIndex = function( callback ){
     model.collection.reIndex( callback );
  }
  this.runCommand = function( cmd, callback ){
    //var tcmodel = db.model('testcases', TestCaseSchema);
    //db.db.executeDbCommand( cmd, callback);
    callback('not supported');
  }
  
  return this;
}
module.exports = Mongo;
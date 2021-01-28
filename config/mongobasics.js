// This should be changed and adapted with database implementation (or removed)
// HERE ARE THE BASIC CRUD OPERATIONS QUERIES THAT ARE SAME FOR ALL TABLES
var connection = require('./connection.js');
var mongoose = require('mongoose');


const db = connection.db;

//creating generic basic sql queries

const mongobasics = {

  // PUT your basic queries HERE
  selectall: function(collectionName, limit ,condition={}, callback) {
    var data= mongoose.model(collectionName).find(condition,function(err, result) {
        if (err) {
            console.log(err);
            return err;
          };
        console.log("DB select all query.");
        callback(result);
    }).limit(limit).sort({ID: 'descending'});
    
  },

  selectone: function(collectionName, id, callback) {
      mongoose.model(collectionName).find({ID: id },function(err, result) {
          if (err) {
              console.log(err);
              return err;
            };
          console.log("DB select one query.");
          callback(result);
      });
    
  },

  insertone: function(collectionName, object,callback) {
      console.log("mongobasics.insertone");
      mongoose.model(collectionName).create(object, function(err, result) {
        if (err) {
          console.log(err);
          return err;
        } else {
          console.log(result);
          callback(result);
        }
      });
  },

  updateone: function(collectionName, condition,object, callback) {
    console.log("mongobasics.updateone");
      mongoose.model(collectionName).updateOne(condition,object,function(err,result) {
              if (err) {
                console.log(err);
                return err;
              } else {
                console.log(result);
                callback(result);
              }
          }

      );
  },

  delete: function(collectionName, condition,callback) {
    console.log("mongobasics.deleteOne");
    console.log(condition);
      db.collection(collectionName).deleteOne(condition, function(err){
          if (err) {
              console.log(err);
              return err;
            }
            callback("DB delete.");
      });
  },


  getmaxid: function(collectionName, callback) {
      let result = db.collection(collectionName).find({}).sort({"ID":-1}).limit(1);
      callback(result);
  },

  initialInsert: function(collectionName,callback) {
    console.log('sqlitebasics.initialInsert')
    connection.initialInsert(function(err, result) {
      if (err) {
        console.log(err);
        return err;
      }
      callback(result);
    });
  }

};


module.exports = mongobasics;
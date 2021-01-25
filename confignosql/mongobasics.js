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
    }).limit(limit);
    
  },

  selectone: function(collectionName, id, callback) {
      mongoose.model(collectionName).find({_id: id },function(err, result) {
          if (err) {
              console.log(err);
              return err;
            };
          console.log("DB select one query.");
          callback(result);
      });
    
  },

  insertone: function(collectionName, values,callback) {
      mongoose.model(collectionName).insertOne(values, function(err) {
          if (err) {
              console.log(err);
              return err;
            }
      });
      console.log("DB insertion.");
      callback("DB insertion.");
  },

  updateone: function(collectionName, condition, values, callback) {
      mongoose.model(collectionName).updateOne(
          { _id: condition },
          values,
          function(err) {
              if (err) {
                  console.log('err');
                  console.log(err);
                  return err;
                }
          }

      );
      callback('Update success');
  },


  delete: function(collectionName, condition) {
      db.collection(collectionName).deleteMany(condition, function(err){
          if (err) {
              console.log(err);
              return err;
            }
            console.log("DB delete.");
      });

  },


  getmaxid: function(collectionName, callback) {
      let result = db.collection(collectionName).find({}).sort({"_id":-1}).limit(1);
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
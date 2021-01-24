// This should be changed and adapted with database implementation (or removed)
// HERE ARE THE BASIC CRUD OPERATIONS QUERIES THAT ARE SAME FOR ALL TABLES
var connection = require('./connection.js');


const db = connection.db;

//creating generic basic sql queries

const mongobasics = {

  // PUT your basic queries HERE

  initialInsert: function(table,callback) {
    console.log('sqlitebasics.initialInsert')
    connection.initialInsert(function(err, result) {
      if (err) {
        console.log(err);
        return err;
      }
      callback(result);
    });
  },

};


module.exports = mongobasics;
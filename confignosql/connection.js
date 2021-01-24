// Connect to SQLite
const sqlite3 = require("sqlite3").verbose();
const migration = require("../migration/migration.js");




// G -- Test  mongo ------------------
// var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/mydb";
var db;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Mongo connected!");
  db=db;
  //db.close();//?
});

(async function() {
  // let url = "mongodb://localhost:27017/mydb"
  let sqlitePath = "./data/db.db";
  migration.initiate(sqlitePath, url);
  await migration.migrate(sqlitePath, url);
  console.log('OVER');
})();


const connection = {
  db: db,
  initialInsert: function(){  
    (async function() {
      // let url = "mongodb://localhost:27017/mydb"
      let sqlitePath = "./data/db.db";
      migration.initiate(sqlitePath, url);
      await migration.migrate(sqlitePath, url);
      console.log('OVER');
    })();
  }
}







// G--------------------


module.exports = connection;


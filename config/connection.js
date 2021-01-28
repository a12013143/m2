// Connect to SQLite
const mongoose = require("mongoose");
const User = require("../models/user");
const Pet = require("../models/pet");
const PetCategory = require("../models/pet_category");
const Article = require("../models/article");
const ArticleCat = require("../models/article_cat");
const Analytics = require("../models/analytics");
const migration = require("../migration/migration.js");



// var url = "mongodb://localhost:27017/mydb";
var url = "mongodb://localhost:27017/mydb";
mongoose.set('useNewUrlParser', true);
mongoose.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Mongo connected!");
});

// (async function() {
//   // let url = "mongodb://localhost:27017/mydb"
//   let sqlitePath = "./data/db.db";
//   await migration.migrate(sqlitePath, url);
//   console.log('OVER');
// })();


const connection = {
  db:  mongoose.connection,
  initialInsert: function(){ // Currently not used 
    console.log("MongoDB initial insertion.");
    var objs = [
      {_id:1,
        name:"Grese Hyseni",email:"hysenigresa@gmail.com",phone:"067239232",address:"Spengergasse",role:"Admin",profile_img_url:"/images/repo/user.png",},
      { _id:2,name:"Hannah Poor",email:"hannahpoor@gmail.com",phone:"067239232",address:"Maria Hilf.",role:"Admin",profile_img_url:"/images/repo/user.png", }
    ];
    mongoose.model('user').insertMany(objs,{ forceServerObjectId: false }).then(function(){ 
      console.log("Data inserted")  // Success 
    }).catch(function(error){ 
      console.log(error)      // Failure 
    });

  },
  migrateFromSqlite: async function(callback) {
      // let url = "mongodb://localhost:27017/mydb"
      let sqlitePath = "./data/db.db";
      await migration.migrate(sqlitePath, url);
      console.log('MIGRATION OVER');
      callback();    
  },
  dropCollections: async function(callback) {
    // let url = "mongodb://localhost:27017/mydb"
    let collections = ["user","article","analytics","pet","pet_category","article_cat"];

    collections.forEach(element => {
      mongoose.model(element).remove({}, function(err) { 
        console.log(element+' collection removed') 
      });
    });
    
    console.log('DROP OVER');
    callback();    
}
}







// G--------------------


module.exports = connection;


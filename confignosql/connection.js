// Connect to SQLite
const mongoose = require("mongoose");
const User = require("../modelsnosql/user");
const Pet = require("../modelsnosql/pet");
const PetCategory = require("../modelsnosql/pet_category");
const Article = require("../modelsnosql/article");
const ArticleCat = require("../modelsnosql/article_cat");
const Analytics = require("../modelsnosql/analytics");
const migration = require("../migration/migration.js");


var url = "mongodb://localhost:27017/mydb";
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
  initialInsert: function(){  
    console.log("MongoDB initial insertion.");

    var objs = [
      {
        _id:1,
        name:"Grese Hyseni",email:"hysenigresa@gmail.com",phone:"067239232",address:"Spengergasse",role:"Admin",profile_img_url:"/images/repo/user.png",
      },
      {
        _id:2,
        name:"Hannah Poor",email:"hannahpoor@gmail.com",phone:"067239232",address:"Maria Hilf.",role:"Admin",profile_img_url:"/images/repo/user.png",
      }
    ];
    mongoose.model('user').insertMany(objs,{ forceServerObjectId: false }).then(function(){ 
      console.log("Data inserted")  // Success 
    }).catch(function(error){ 
      console.log(error)      // Failure 
    });

    
    // Article Categories
    //ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT 
 

    

    //Articles
    //ID,name TEXT, author TEXT, short_desc TEXT, description TEXT, userID INT, created_at TEXT, updated_at TEXT, article_catID INT

    

    // Pet Categories
    //ID INT UNIQUE PRIMARY KEY, name TEXT, description TEXT 

    
    
    // Pets
    //ID , ownerID INT, name TEXT, address TEXT, categoryID INT, neutered INT, age_year INT, age_month INT, short_desc TEXT, description TEXT, profile_img_url 
    // Adoption
    // ID, userID INT, petID INT, description TEXT, status 



    // Favourite
    //ID,userID INT, petID INT,

    

  },
  migrateFromSqlite: async function(callback) {
      // let url = "mongodb://localhost:27017/mydb"
      let sqlitePath = "./data/db.db";
      await migration.migrate(sqlitePath, url);
      console.log('OVER');
      callback();    
  }
}







// G--------------------


module.exports = connection;


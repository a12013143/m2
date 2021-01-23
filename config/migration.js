// Connect to SQLite
var connection = require('./connection.js');
const db = connection.db;

const migration = require("../migration/migration.js");

console.log("\n\n");
console.log("Migration");

console.log(migration);
console.log("\n\n");


(async function() {
    let mongodb = "mongodb://localhost:27017/mydb"
    let sqlitePath = "./data/db.db";
    migration.initiate(sqlitePath, mongodb);
    await migration.migrate(sqlitePath, mongodb);
    console.log('OVER');
})();





// var tables = {
// pet:
// adoption:
// }

// var selectall = function(table, callback) {
//     let queryString = 'SELECT * FROM ' + table + ' ORDER BY ID DESC;';
//     console.log(queryString);
//     db.all(queryString, [], (err, rows) => {
//       if(err) {
//         console.log(err);
//         return err;
//       }
//       console.log("DB select all query.");
//       callback(rows);
//     });
//   };

//   selectall('pet',function(data){
//       //console.log(data)

//   });
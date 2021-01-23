const sqliteMigrate = require("./sqlite.js");
const mongoMigrate = require("./mongo.js");
const fs = require("fs");



const migration = {
    initiate: function(sqlitePath, mongoUrl) {
        this.sqlitePath = sqlitePath;
        this.mongoUrl = mongoUrl;
    },
    migrate:
     async function() {
       return new Promise( async (resolve, reject) => {
             try {

                console.log("\nMigration initiated");

                let sqlitePath = this.sqlitePath;

                console.log("\nSqlite path :: " + this.sqlitePath);
                if(!fs.existsSync(sqlitePath)) {
                    throw new Error("The given sqlite path is not valid. Please provide a valid path");
                }

                let mongoUrl = this.mongoUrl;
                console.log("\nMongo Url path :: " + mongoUrl);
                

                
                sqliteMigrate.initiate(sqlitePath);
                mongoMigrate.initiate(mongoUrl);

                await sqliteMigrate.openSqliteDb();
                console.log("\nConnection initiated with sqlite database");

                await mongoMigrate.openMongoDb();
                console.log("\nConnection initiated with mongo database");

                let tableNames = await sqliteMigrate.getSqliteTableNames();
                console.log("\nTrying to migrate " + tableNames.length + " sqlite tables");

                for(let i = 0; i<tableNames.length; i++) {
                    let tableName = tableNames[i].name;
                    console.log("\nMigration initiated for the table :: " + tableName);

                    await this.migrateTable(sqliteMigrate, mongoMigrate, tableName);

                    console.log("\nMigration completed for the table :: " + tableName);
                }

                resolve();
            }
            catch(err) {
                console.log("\nError in migration", err);
                console.log("\n\n\n=============Error in migration===============\n\n");
                reject(err);
            }
        // }
        // );
    })},
    migrateTable:
     async function (sqliteMigrate, mongoMigrate, tableName) {
         return new Promise( async (resolve, reject) => {
            try {
                let limit = 100, offset = 0;
                let rowCount = sqliteMigrate.getRowCount(tableName);
                let queryCount = Math.ceil(rowCount/limit) || 1;
                let collectionName = await mongoMigrate.createCollection(tableName);;

                for(let i = 0; i<queryCount; i++) {
                    let tableData = await sqliteMigrate.getSqliteTableData(tableName, offset, limit);
                    if(tableData && tableData.length) {
                        await mongoMigrate
                            .setCollectionName(collectionName)
                            .insertIntoCollection(tableData);
                        mongoMigrate.resetCollectionName();
                    }
                }
                resolve({
                    code : "200",
                    message : "Migrating " + tableName + " completed"
                });
            }
            catch(err) {
                console.log('err')
                console.log(err)
                reject(err);
            }
         })
    }
}



module.exports =  migration;
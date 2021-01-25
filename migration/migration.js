const sqliteMigrate = require("./sqlite.js");
const mongoMigrate = require("./mongo.js");
const fs = require("fs");
const { MongooseDocument } = require("mongoose");


//GET schema



const migration = {
    migrate:
     async function(sqlitePath, mongoUrl) {

        this.tables = [
            {
                mainTableName:"user",
            },
            {
                mainTableName:"article",
            },
            {
                mainTableName:"analytics",
            },
            {
                mainTableName:"pet",
                nested:[
                    {nestedTableName:"adoption", foreignId:"petID", newFieldName:"adoptions"},
                    {nestedTableName:"favourite",foreignId:"petID", newFieldName:"favourited_by"},
                ]
            },
            {
                mainTableName:"pet_category"
                // ,nested:[
                //     {nestedTableName:"pet", foreignId:"categoryID", newFieldName:"pets"},
                // ]
            },
            {
                mainTableName:"article_cat"
                // ,nested:[                    
                //     {nestedTableName:"article", foreignId:"categoryID", newFieldName:"articles"},
                // ]
            }                  
        ];

       return new Promise( async (resolve, reject) => {

             try {

                console.log("\nMigration initiated");
                console.log("\nSqlite path :: " + sqlitePath);
                if(!fs.existsSync(sqlitePath)) {
                    throw new Error("The given Sqlite path is not valid.");
                }
                await sqliteMigrate.openSqliteDb(sqlitePath);
                console.log("\nConnection initiated with sqlite database");
                await mongoMigrate.openMongoDb(mongoUrl);
                console.log("\nConnection initiated with mongo database");

                //let tableNames = await sqliteMigrate.getSqliteTableNames();
                let tableNames = this.tables;
                console.log("\nTrying to migrate " + tableNames.length + " sqlite tables");            

                //Migrate flat tables
                for(let i = 0; i<this.tables.length; i++) {
                    let tableName = tableNames[i].mainTableName;  
                    if(tableNames[i].nested){
                        console.log("\nMigration initiated for the nested table :: " + tableName);
                        await this.migrateNestedTable(sqliteMigrate, mongoMigrate, tableName);    
                        console.log("\nMigration completed for the nested table :: " + tableName);
                    }else{
                        console.log("\nMigration initiated for the table :: " + tableName);
                        await this.migrateTable(sqliteMigrate, mongoMigrate, tableName);    
                        console.log("\nMigration completed for the table :: " + tableName);
                    }

                }


                resolve();
            }
            catch(err) {
                console.log("\nError in migration", err);
                console.log("\n\n\n=============Error in migration===============\n\n");
                reject(err);
            }
    })},
    migrateTable:
     async function (sqliteMigrate, mongoMigrate, tableName) {
         return new Promise( async (resolve, reject) => {
            try {
                let limit = 100, offset = 0;
                let rowCount = sqliteMigrate.getRowCount(tableName);
                let queryCount = Math.ceil(rowCount/limit) || 1;

                for(let i = 0; i<queryCount; i++) {
                    let tableData = await sqliteMigrate.getSqliteTableData(tableName, offset, limit);

                    if(tableData && tableData.length) {

                        // Change field ID in Sqlite to _id in MongoDB
                        console.log("\n\n");
                        tableData.forEach(element => {
                            element._id = element.ID;
                            delete element.ID;
                        });                    
                        console.log(tableData);
                        console.log("\n\n");

                        await mongoMigrate
                             .insertIntoCollection(tableData,tableName);
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
    },
    migrateNestedTable: async function (sqliteMigrate, mongoMigrate, tableName) {
        return new Promise( async (resolve, reject) => {
           try {

                    let limit = 100, offset = 0;
                    let rowCount = sqliteMigrate.getRowCount(tableName);
                    let queryCount = Math.ceil(rowCount/limit) || 1;

                    console.log("\n\n\nqueryCount");
                    console.log(queryCount);
                    console.log(tableName);
                    
                    for(let i = 0; i<queryCount; i++) {

                        let tableData = await sqliteMigrate.getSqliteTableData(tableName, offset, limit);                        
                        let tableNestedFiltered = this.tables.find(({ mainTableName }) => mainTableName == tableName);

                        for (let i = 0; i< tableData.length;i++){
                            
                             //Change IDs to _ids
                            let _id = tableData[i].ID
                            tableData[i]._id = tableData[i].ID;
                            delete tableData[i].ID;
                            
                            // Get all data that has _id as a foreign key, and save that as an array for the particular row
                            for (let j = 0; j< tableNestedFiltered.nested.length;j++){

                                console.log('\n\ntableNestedFiltered[j]');
                                let subTable = tableNestedFiltered.nested[j].nestedTableName;
                                let foreignField = tableNestedFiltered.nested[j].foreignId;
                                let newFieldName = tableNestedFiltered.nested[j].newFieldName;
                                console.log(tableNestedFiltered.nested[j]);

                                 //Get all adoptions with this _id
                                 let nestedTableData = await sqliteMigrate
                                 .getSqliteTableDataByForeignId(subTable,foreignField,_id);   
                                 
                                 //Change IDs to _ids
                                 nestedTableData.forEach(element => {
                                    element._id = element.ID;
                                    delete element.ID;
                                 });
                                 
                                 tableData[i][newFieldName]=nestedTableData;     
                            }
                        }

                            if(tableData && tableData.length) {
                                // console.log('\n--------------tableData----------------\n');
                                // console.log(tableData);

                                 //Find one by _id and insert                                
                                 await mongoMigrate
                                 .insertIntoCollection(tableData,tableName);
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
        })}
}



module.exports =  migration;
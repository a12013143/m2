const sqliteMigrate = require("./sqlite.js");
const mongoMigrate = require("./mongo.js");
const fs = require("fs");
const { MongooseDocument } = require("mongoose");


//GET schema



var migration = {
    // The order of the tables is crucial to correct insertion of reference fields (foreign ids)
    tables:[
        {
            tableName:"user",
        },
        {
            tableName:"article_cat"
        }, 
        {
            tableName:"article",
            refIdFields:["categoryID","userID"]
        },
        {
            tableName:"analytics",
            refIdFields:["categoryID","pageID"]
        },
        {
            tableName:"pet_category"
        }, 
        {
            tableName:"pet",
            refIdFields:["categoryID","ownerID"],
            subCollection:[{
                collection:"adoption", fieldName:"adoptions", fieldId:"petID",
                refIdFields:["userID"]},
                // {
                //     collection:"favourite", fieldName:"favourited_by", fieldId:"petID",
                //     refIdFields:["userID"]}
            ]
        }              
    ],
    migrate:
     async function(sqlitePath, mongoUrl) {
       return new Promise( async (resolve, reject) => {
             try {

                console.log("\nMigration start");
                console.log("\nSqlite path :" + sqlitePath);
                if(!fs.existsSync(sqlitePath)) {
                    throw new Error("The given Sqlite path is not valid.");
                }
                await sqliteMigrate.openSqliteDb(sqlitePath);
                console.log("\nConnection start with sqlite database");
                await mongoMigrate.openMongoDb(mongoUrl);
                console.log("\nConnection start with mongo database");

                let tableNames = await sqliteMigrate.getSqliteTableNames();
                console.log({tableNames});
                console.log(tableNames);
                let tables = this.tables;          

                //Migrate tables
                this.mapIds=[];
                for(let i = 0; i<this.tables.length; i++) {

                    let table = tables[i];  
                    let tableName = tables[i].tableName;  

                    console.log("\nMigration start for the table :" + tableName);
                    await this.migrateTable(sqliteMigrate, mongoMigrate, table);  
                    console.log("\nMigration completed for the table :" + tableName,);

                }
                // resolve();
            }
            catch(err) {
                console.log("\nError in migration", err);
                console.log("\n");
                reject(err);
            }
    })},
    migrateTable:
     async function (sqliteMigrate, mongoMigrate, table) {         
            try {
                
                let tableName = table.tableName;
                let limit = 200, offset = 0;
                let rowCount = sqliteMigrate.getRowCount(tableName);
                let queryCount = Math.ceil(rowCount/limit) || 1;

                for(let i = 0; i<queryCount; i++) {
                    let condition= " LIMIT "+limit+" OFFSET "+offset+";"
                    let tableData = await sqliteMigrate.getSqliteTableData(tableName,condition);
                    console.log('\nTable Data from sqlite');
                    console.log(tableData);

                    if(tableData && tableData.length) {

                        // Replace reference fields ids to new generated ids                       
                        tableData.forEach(row => {
                            // If table contains foreign keys, replace those with new corresponding generated ids
                            // using te mapIds array where we save old and new ids for each table to collection created.
                            // this.mapRefIds(table,row);                         
                         });

                         console.log('Table:'+tableName);
                         console.log('this.mapIds');
                         console.log(this.mapIds);
                         
                         var thisObj = this;
                         mongoMigrate.insertIntoCollection(tableData,tableName, async function(data){
                             console.log('Inserted data');
                             console.log("Migrating " + tableName + " completed");        
                             
                             console.log("Count old table rows " + tableData.length + ".");  
                             console.log("Count new table rows " + data.length + ".");  
                             
                             
                             for (let i =0;i<tableData.length;i++){

                                //Save mapping of new generated IDs to old IDS
                                //  var mapId = {oldId:tableData[i].ID,newId:data[i].ID};
                                //  thisObj.mapIds.push(mapId);                             
                            
                                if(table.subCollection)
                                {
                                    for (let i = 0; i< table.subCollection.length;i++) {

                                        subCollection= table.subCollection[i];
                                        let subTableName = subCollection.collection;
                                        let fieldName = subCollection.fieldName;
                                        let fieldId = subCollection.fieldId;
                                        let condition = " WHERE "+fieldId+" = "+ tableData[i].ID;
                                        condition+ " LIMIT "+limit+" OFFSET "+offset+";"
    
                                        console.log('Subcollection inserting for '+ tableName);
                                        
                                        let subtableData = await sqliteMigrate.getSqliteTableData(subTableName,condition);
    
                                        
                                        // for (let i =0;i<subtableData.length;i++){
                                        //     thisObj.mapRefIds(subCollection,subtableData[i]);
                                        // }
                                        
                                         mongoMigrate.insertIntoSubCollection(subtableData,tableName,fieldName,data[i]._id,function(data){
                                         console.log('Inserted data');
                                         console.log("Migrating " + tableName + " completed");                            
                                        
                                        //  for (let i =0;i<data.length;i++){
                                        //      var mapId = {oldIs:tableData[i].ID,newId:data[i].ID};
                                        //      thisObj.mapIds.push(mapId);                                
                                        //  }
                                    });
                                        
                                    }

                                   
                                
                                }
                            }
        
                         });
                    }
                }
            }
            catch(err) {
                console.log('err')
                console.log(err)
                reject(err);
            }
    },
    // mapRefIds:function(table,row){
    //     if(table.refIdFields){
    //         table.refIdFields.forEach(refIdField => {
    //             let oldId = row[refIdField];
    //             let mapId = this.mapIds.find(element => element.oldId = oldId);
    //             if(mapId){
    //                 row[refIdField]= mapId.newId;
    //             }
    //         });
    //     } 
    // }
}



module.exports =  migration;
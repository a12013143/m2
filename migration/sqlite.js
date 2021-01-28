const sqlite3 = require("sqlite3");

const sqliteMigrate = {

    /* open Sqlite db */
    openSqliteDb: function(sqlitePath) {
        return new Promise( (resolve, reject) => {
            let sqlitedb = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY, (err) => {
                if(err) {
                    reject(err);
                }
                else {
                    this.sqlitedb = sqlitedb;
                    resolve();
                }
            });
        });
    },

    getSqliteTableNames: function () {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT name FROM sqlite_master WHERE type = ?";
            let params = ["table"];
            console.log('\nparams');
            console.log(params);
            this.sqlitedb.all(sql, params, (err, rows) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    },

    getRowCount: function (tableName) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT COUNT(*) AS ct FROM "+tableName;
            console.log('\nSQL');
            console.log(sql);
            let params = [""+tableName];
            console.log('\nparams');
            console.log(params);
            this.sqlitedb.all(sql, [], (err, result) => {
                if(err) {
                    console.log('\nerr');
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log('\nresult');
                    console.log(result);
                    resolve(result[0].ct);
                }
            });
        });
    }, 

    getSqliteTableData: function (tableName, condition,offset, limit) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM " + tableName ;
            
            if(condition){
                sql+=condition;
            }
            
            let params = [limit, offset];
            this.sqlitedb.all(sql, [], (err, rows) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        }); 
    },
    getSqliteTableDataByForeignId: function (tableName,fieldname,value) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM " + tableName + " where "+fieldname+" ="+value;
            let params = [];
            this.sqlitedb.all(sql, params, (err, rows) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        }); 
    }
}

module.exports = sqliteMigrate;

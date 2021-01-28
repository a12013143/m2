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
            let sql = "SELECT COUNT(*) AS COUNT FROM ?";
            let params = [tableName];
            this.sqlitedb.run(sql, params, (err, result) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result.COUNT);
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
            
            sql+= " LIMIT ? OFFSET ?";
            let params = [limit, offset];
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

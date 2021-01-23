const sqlite3 = require("sqlite3");

const sqliteMigrate = {

    initiate: function(sqlitePath) {
        this.sqlitePath = sqlitePath;
        this.sqlitedb = undefined;
    },

    /* open Sqlite db */
    openSqliteDb: function() {
        return new Promise( (resolve, reject) => {
            let sqlitePath = this.sqlitePath;
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

    getSqliteTableData: function (tableName, offset, limit) {
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM " + tableName + " LIMIT ? OFFSET ?";
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
    }
}

module.exports = sqliteMigrate;

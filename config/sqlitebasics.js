// This should be changed and adapted with database implementation (or removed)
// HERE ARE THE BASIC CRUD OPERATIONS QUERIES THAT ARE SAME FOR ALL TABLES
var connection = require('./connection.js');
var migration = require('./migration.js');

const db = connection.db;

//creating generic basic sql queries

const sqlitebasics = {
  selectall: function(table, callback) {
    let queryString = 'SELECT * FROM ' + table + ' ORDER BY ID DESC;';
    console.log(queryString);
    db.all(queryString, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      console.log("DB select all query.");
      callback(rows);
    });
  },

  selectone: function(table, id, callback) {
    let queryString = 'SELECT * FROM ' + table + ' WHERE 0 = 0 ';
    if(id!=''){
      queryString+= " AND ID ="+id;
    }
    queryString+= ";";
    console.log(queryString);
    db.all(queryString, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      console.log("DB select one.");
      callback(rows);
    });
  },

  insertone: function(table, values, callback) {
    let queryString = 'INSERT INTO ' + table + ' VALUES ' + values +');';
    console.log(queryString);
    db.run(queryString, err => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log("DB insertion.");
      callback("DB insertion.");
    });
  },

  updateone: function(table, columns, values, condition, callback) {
   
    let queryString = 'UPDATE ' + table + ' SET ';
    let i;
    for (i=0; i < columns.length; i++) {
      queryString = queryString + columns[i] + ' = "' + values[i] + '"';
      if (i < columns.length-1) {
        queryString = queryString + ', ';
      }
    }
    queryString = queryString + ' WHERE ' + condition + ';'
    console.log('sqlitebasics.updateoneee');
    console.log(queryString);

    db.run(queryString, err => {
      if (err) {
        console.log('err');
        console.log(err);
        return err;
      }
      callback('Update success');
    });
    
  },

  delete: function(table, condition, callback) {
    let queryString = 'DELETE FROM ' + table + ' WHERE ' + condition + ';';
    console.log(queryString);
    db.run(queryString, err => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log("DB delete.");
   });

  },

  initialInsert: function(table,callback) {
    console.log('sqlitebasics.initialInsert')
    connection.initialInsert(function(err, result) {
      if (err) {
        console.log(err);
        return err;
      }
      callback(result);
    });
  },

  getmaxid: function(table,callback) {
    let queryforID = 'SELECT MAX(ID) AS ID FROM '+table+';';
    console.log(queryforID);
    db.all(queryforID, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      callback(rows);
    });
  },
};




module.exports = sqlitebasics;
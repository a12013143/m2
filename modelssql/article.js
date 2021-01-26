 // This should be changed and adapted with database implementation  
 var connection = require('../config/connection.js');

const db = connection.db;


const article = {

  getmaxid: function(callback) {
    let queryforID = 'SELECT MAX(ID) AS ID FROM article;';
    console.log(queryforID);
    db.all(queryforID, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      callback(rows);
    });
  },

  getdate: function(callback) {

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  callback(today);
  },

  
  selectall: function(table, callback, condition) {
    // console.log('condition');
    // console.log(condition);

    let queryString = 'SELECT * FROM ' + table + ' WHERE 0=0';    
    var whereClause = '';
    
    if(condition){
      if(condition.keyword){
        console.log('keyword')
        var keyword = '%'+condition.keyword+'%';
        whereClause+= ' AND (name LIKE "'+keyword+'" OR short_desc LIKE "' + keyword +'" OR description LIKE "' + keyword+'")';
      }
      if(condition.category){
        whereClause+= ' AND categoryID = '+condition.category;
      }
    }

    queryString+=whereClause+' ORDER BY ID DESC;'
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


  selectone: function(param, callback){
    let queryString = 'SELECT * FROM article WHERE ID = ' + param + ';';
    console.log(queryString);
    db.all(queryString, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      console.log(queryString);
      console.log("DB select one query (pet).");
      callback(rows);
    });
  }

}


module.exports = article;
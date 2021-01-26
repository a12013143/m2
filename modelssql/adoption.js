// This should be changed and adapted with database implementation 
var connection = require('../config/connection.js');

const db = connection.db;

const adoption = {

  getmaxid: function(callback) {
    let queryforID = 'SELECT MAX(ID) AS ID FROM adoption;';
    console.log(queryforID);
    db.all(queryforID, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      callback(rows);
    });
  },

  // select filtered
  selectall: function(table, condition, callback) {
    console.log('_asoption.selectall')
    let queryString = 'SELECT p.*,u2.*, u.name ownerName, p.name petName, p.profile_img_url pet_profile_img_url,t.*  FROM ' + table +
     ' t LEFT JOIN pet p on p.id = t.petID LEFT JOIN user u on p.ownerID = u.ID left join user u2 on u2.id = t.userID WHERE 0=0';    
    var whereClause = ''; 
    if(condition){
      if(condition.userID){
        queryString += ' AND p.ownerID = '+condition.userID ;
      }
    }
    queryString +=' ORDER BY ID DESC;';
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
}

module.exports = adoption;
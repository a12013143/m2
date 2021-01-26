// This should be changed and adapted with database implementation 
var connection = require('../config/connection.js');

const db = connection.db;

const pet = {

  getmaxid: function(callback) {
    let queryforID = 'SELECT MAX(ID) AS ID FROM pet;';
    console.log(queryforID);
    db.all(queryforID, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      callback(rows);
    });
  },


  selectall: function(table, callback, condition) {
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

  selectjustone: function(param, callback) {
    let queryString = 'SELECT * FROM pet WHERE ID = ' + param +';';
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
  },


//this is a really bad sql query but it's 6 am and I want to sleep
  selectone: function(param, callback) {
    //let queryString = 'SELECT * FROM pet WHERE ID = ' + param +';';
    let queryString = 'SELECT * FROM(SELECT * FROM(SELECT * FROM(SELECT COUNT(*) AS favourites from(SELECT * from favourite WHERE petID =' + param +' ))INNER JOIN(SELECT * from pet WHERE ID = '+ param +' ))INNER JOIN(SELECT COUNT(*) as applications FROM(SELECT * from adoption WHERE petID = ' + param + ')))INNER JOIN(SELECT address from user WHERE ID = (SELECT ownerID FROM pet WHERE ID = ' +param +'));';
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
  },

  // Analytics
  analytics: function(param, callback, condition) {

    let queryString = 
    'SELECT count(a.ID) adoptions, count(DISTINCT ua.ID) adopters, count(f.ID) favourite, count(DISTINCT uf.ID) fans,  a.status,pc.name,p.categoryID '+
    // ', CASE p.neutered WHEN  "1" THEN "Neutered"'+
    // '      when  "2" then "Not Neutered"'+
    // '      else  "Unknown" end neuteredText'+
    ' from pet p '+
    ' LEFT JOIN adoption a on a.petID = p.ID '+
    ' LEFT JOIN favourite f on f.petID = p.ID '+
    ' LEFT JOIN user ua on ua.ID = a.userID'+
    ' LEFT JOIN pet_category pc on pc.ID = p.categoryID'+
    ' LEFT JOIN user uf on uf.ID = f.userID WHERE 0=0 ';

    var whereClause = '';
    
    if(condition){
      if(condition.keyword){
        console.log('keyword')
        var keyword = '%'+condition.keyword+'%';
        whereClause+= ' AND (p.name LIKE "'+keyword+'" OR p.short_desc LIKE "' + keyword +'" OR p.description LIKE "' + keyword+'")';
      }
      if(condition.category){
        whereClause+= ' AND p.categoryID = '+condition.category;
      }
      if(condition.neutered){
        whereClause+= ' AND p.neutered = '+condition.neutered;
      }
      if(condition.adoption_status){
        whereClause+= ' AND a.status = '+condition.adoption_status;
      }
    }
    
    queryString+=whereClause+' ';

    queryString+=' GROUP BY a.status, pc.ID ;';
    //console.log(queryString);

    db.all(queryString, [], (err, rows) => {
      if(err) {
        console.log(err);
        return err;
      }
      console.log(queryString);
      console.log("DB pet analytics query.");
      callback(rows);
    });
  },

    // Stats
    stats: function(param, callback, condition) {

      let queryString = 
      'WITH counts as ( SELECT p.ID petID,' +
      '      CASE' +
      '           WHEN pc.name="Cats" and a.status="Approved"' +
      '               THEN 1' +
      '      END adoptedCats,' +
      '      CASE' +
      '           WHEN pc.name="Dogs" and a.status="Approved"' +
      '               THEN 1' +
      '      END adoptedDogs,' +
      '      CASE' +
      '           WHEN pc.name <> "Dogs" and pc.name <> "Cats" and a.status="Approved"' +
      '               THEN 1' +
      '      END adoptedOther,' +
      '      CASE' +
      '           WHEN pc.name="Cats" and a.status<>"Approved"' +
      '               THEN 1' +
      '      END availableCats,' +
      '      CASE' +
      '           WHEN pc.name="Dogs" and a.status<>"Approved"' +
      '               THEN 1' +
      '      END availableDogs,' +
      '      CASE' +
      '      WHEN pc.name <> "Dogs" and pc.name <> "Cats" and a.status="Approved"' +
      '          THEN 1' +
      ' END availableOther' +
      ' FROM pet p'+
      ' LEFT JOIN pet_category pc on p.categoryID=pc.ID'+
      ' LEFT JOIN adoption a on p.ID = a.petID' +
      ' GROUP BY' +
      '  CASE' +
      '      WHEN pc.name="Cats" and a.status="Approved"' +
      '          THEN 1' +
      '      END , ' +
      '      CASE' +
      '           WHEN pc.name="Dogs" and a.status="Approved"' +
      '               THEN 1' +
      '      END ,' +
      '      CASE' +
      '           WHEN pc.name <> "Dogs" and pc.name <> "cat" and a.status="Approved"' +
      '               THEN 1' +
      '      END ,' +
      '      CASE' +
      '           WHEN pc.name="Cats" and a.status<>"Approved"' +
      '               THEN 1' +
      '      END ,' +
      '      CASE' +
      '           WHEN pc.name="Dogs" and a.status<>"Approved"' +
      '               THEN 1' +
      '      END ,' +
      '      CASE' +
      '           WHEN pc.name <> "Dogs" and pc.name <> "Cats" and a.status="Approved"' +
      '               THEN 1' +
      '      END )' +
      ' SELECT sum(counts.adoptedCats) adoptedCats, sum(counts.adoptedDogs) adoptedDogs, sum(counts.adoptedOther) adoptedOther, '+
      ' sum(counts.availableCats) availableCats, sum(counts.availableDogs) availableDogs, sum(counts.availableOther) availableOther '+
      ' FROM pet p left join counts on counts.petID = p.id ' +
      ' WHERE 0 = 0';
  
      var whereClause = '';
      
      if(condition){
        if(condition.keyword){
          console.log('keyword')
          var keyword = '%'+condition.keyword+'%';
          whereClause+= ' AND (p.name LIKE "'+keyword+'" OR p.short_desc LIKE "' + keyword +'" OR p.description LIKE "' + keyword+'")';
        }
        if(condition.category){
          whereClause+= ' AND p.categoryID = '+condition.category;
        }
        if(condition.neutered){
          whereClause+= ' AND p.neutered = '+condition.neutered;
        }
        if(condition.adoption_status){
          whereClause+= ' AND a.status = '+condition.adoption_status;
        }
      }
      
      queryString+=whereClause+';'
      //console.log(queryString);
  
      db.all(queryString, [], (err, rows) => {
        if(err) {
          console.log(err);
          return err;
        }
        console.log(queryString);
        console.log("DB pet analytics query.");
        callback(rows);
      });
    },

}

module.exports = pet;
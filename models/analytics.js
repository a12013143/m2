// This should be changed and adapted with database implementation 
var connection = require('../config/connection.js');

const db = connection.db;

const analytics = {

//   id: 1,
//   url:'/analytics/1',// groupby page
//   page_id:1, // this is extracted from url
//   analytic:{title:"Analytic Title"},
//   type: 'analytic', // this is extracted from url
//   visits:3 ,  // count ids 
//   visitors:2, // count user_ids for page
//   time:30, //sum for page

  // select filtered
  selectGrouped: function(table, condition, callback) {
    console.log('_analytics.selectall')

    let queryString = 'SELECT url, count( DISTINCT userID) visitors, count(*) visits, sum(time) time, max(created_at) created_at, '+
    ' CASE WHEN url like "%article%" and pageID is not NULL THEN "Article"  '+
    '      WHEN url like "%pet%" and pageID is not NULL THEN "Pet"  '+
    '      WHEN url = "/"  THEN "Home page"  '+
    '      ELSE "Other"  END type'+
    '   FROM ' + table +
     ' t WHERE 0=0';    
 
    if(condition){
      if(condition.start_date){
        queryString += ' AND created_at >= "'+condition.start_date+'"' ;
      }
      if(condition.end_date){
        queryString += ' AND created_at <= "'+condition.end_date+'"' ;
      }
    }
    queryString +=' GROUP BY url, '+
    ' CASE WHEN url like "%article%" and pageID is not NULL THEN "Article"  '+
    '      WHEN url like "%pet%" and pageID is not NULL THEN "Pet"  '+
    '      WHEN url = "/"  THEN "Home page"  '+
    '      ELSE "Other"  END'+ ' ORDER BY time,ID DESC;';
    
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

module.exports = analytics;
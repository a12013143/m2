var express = require('express');
const connection = require('../config/connection');
const sqlitebasics = require('../config/sqlitebasics');
var router = express.Router();
var _article = require('../models/article.js')
var _adoption = require('../models/adoption.js')



/** GET */
router.get('/', function(req, res) {

  console.log('req.query pets get');
  console.log(req.query);

  var categories = [];
  
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
  sqlitebasics.selectone("user",userID, function(data) {
    user = data[0];
    console.log('user');
    console.log(user);
    condition={userID};    
    _adoption.selectall("adoption",condition, function(data) {
      if(user && data){
        user.adoptions = data;
        user.show_adoptions = user.adoptions.slice(0,3);
        console.log('show_adoptions');
        console.log(user.show_adoptions);
      }          
       sqlitebasics.selectall("article_cat" , function(data) {
         categories = data;
         console.log('Article page categories');
         console.log(data);
         renderHtmlAfterCategoriesLoad();
       }, {});
          
    });
  });
 
   // Get pets by query data
   function renderHtmlAfterCategoriesLoad(){
     console.log('renderHtmlAfterCategoriesLoad');
     var condition = {};
     if(req.query.category){
       condition.category = req.query.category;
     }
     if(req.query.keyword){
       condition.keyword = req.query.keyword;
     }
     _article.selectall("article" , function(data) {
       articles = data;
       console.log('Article page articles');
       console.log(data);
       var header_image = "/images/repo/ronald.jpg";
       res.render('articles', { title: 'Articles' ,articles,categories,condition,header_image,user});
     }, condition);
   }
 });

 /** GET by articleId*/
router.get('/:articleId', function(req, res) {

  console.log('req.session articles get by articleid');
  console.log(req.session);
  var categories = [];
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
  sqlitebasics.selectone("user",userID, function(data) {
    user = data[0];
    console.log('user');
    console.log(user);
    condition={userID};    
    _adoption.selectall("adoption",condition, function(data) {
      if(user && data){
        user.adoptions = data;
        user.show_adoptions = user.adoptions.slice(0,3);
        console.log('show_adoptions');
        console.log(user.show_adoptions);
      }     
      
      // Get categories;
      sqlitebasics.selectall("article_cat" , function(data) {
        categories = data;
        console.log('Articles page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {});
          
    });
  });
  
  function renderHtmlAfterCategoriesLoad(){
    var articleId = req.params.articleId;
    let temp = articleId;
    if(articleId == "new"){
      article = {ID:0, profile_img_url:"/images/pawprint-blue.png"};
      var header_image = article.profile_img_url;
      res.render('article', { title: 'Articles - New' ,categories, article, header_image,user});
    }else{
      _article.selectone(temp, function(data) {
        article = data[0];
        console.log('article---');
        console.log(article);

        if (data.err){
          res.status(500).json({
            'message': 'Internal Error.'
          });
        } else {
          var header_image = '/images/petcare-large.jpg';
          var title = 'Article not found';
          if(article){
            header_image = article.profile_img_url;
            title = article.name;
          }
          res.render('article', { title: title, categories, article,header_image,user});
        
        }
      });
    }
  }
 
});


/** POST */
router.post('/', function(req, res) {

  console.log('req.body articles post');
  console.log(req.body);

  let maxrowID = 0;
  _article.getmaxid(function(data) {
    maxrowID = data[0].ID + 1;

    var vals = req.body;
    var keys = Object.keys(req.body);
    var i =0;
    keys.forEach(function(key){;
      var str = ['name','author','short_desc','description','profile_img_url'];
        if(!vals[key] && !str.includes(key) ){
          vals[key] = 'null';
        }
    }) 

    //7, "Article Title", "Author Name", "'+desc1+'","'+short_desc1+'", 1, "01/11/2021", "01/11/2021", 1, "'+imgurl+'"
    let querytemp = '(' + maxrowID + ', "' + vals.name +'", "' + vals.author + '", "' + vals.description + '", "' + vals.short_desc + '", ' + vals.userID + ', "' + vals.created_at + '", "' + vals.updated_at+ '", '  + vals.categoryID + ', ' + /*req.body.profile_img_url + '"'*/ '"/images/repo/petcare-large.jpg"';
    console.log('querytemp')
    console.log(querytemp)
    sqlitebasics.insertone("article" , querytemp, function(data) {
      categories = data;
      console.log('sqlitebasics.insertone');
      console.log(data);
  
      if (data){
        res.status(200).json(data);
      } else {      
        res.status(500).json({
          'message': 'Internal Error.'
        });
      }
    });
  });
});


/** PUT */
router.put('/:ID', function(req, res) {

  console.log('req.body articles put');
  console.log(req.body);

  var articleId = req.body.ID;
  var condition = 'ID = ' + articleId;

  var columns = Object.keys(req.body);
  var values = Object.values(req.body);

  sqlitebasics.updateone("article" , columns, values, condition, function(data) {
    categories = data;
    console.log('sqlitebasics.updateone');
    console.log(data);

    if (data){
      res.status(200).json(data);
    } else {      
      res.status(500).json({
        'message': 'Internal Error.'
      });
    }
  });

});

/** DELETE */
router.delete('/:id', function(req, res) {
  let articleId = req.params.id;
  let condition = 'ID = ' + articleId;

  console.log('Delete article');
  sqlitebasics.delete("article", condition, function(data){  
    console.log('sqlitebasics.delete');  
    console.log(data);

    if (data){
      res.status(200).json(data);
    } else {      
      res.status(500).json({
        'message': 'Internal Error.'
      });
    }
  })
 
});



module.exports = router;
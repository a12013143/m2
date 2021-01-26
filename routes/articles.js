var express = require('express');
const connection = require('../confignosql/connection');
const mongobasics = require('../confignosql/mongobasics');
var router = express.Router();
var _article = require('../models/article.js');



/** GET */
router.get('/', function(req, res) {

  console.log('req.query pets get');
  console.log(req.query);

  var categories = [];  

  // HEADER USER
 var userID = req.query.userId;
 if(!userID){
   userID=1;
 }
 var user = {ID:userID}
 mongobasics.selectone("user",userID, function(data) {
   user = data[0];
   if(!user){
     console.log("\nres.redirect('/register')\n");
     res.redirect('/register');
     return;
   }

   // HEADER peT ADOPTION REQUESTS

   let condition={ownerID: userID};

   mongobasics.selectall("pet",null,condition, function(data){
     user.adoptions = [];

     //Get pets to get adoptions
     pets = data;
     //Save pet adoptions to user.adoptions
     if(data){
       data.forEach(dataItem => {
         if(dataItem.adoptions.length>0){ 
           //set adoptions petname
            let i = 0;
             dataItem.adoptions.forEach(adoption => {
             dataItem.adoptions[i].petName = dataItem.name;              
             dataItem.adoptions[i].profile_img_url = dataItem.profile_img_url;
             i++;
           });
           user.adoptions=user.adoptions.concat(dataItem.adoptions);
         }
       });
     }

     //user adoptions
     user.show_adoptions= user.adoptions.slice(0,3);
     console.log('user.show_adoptions');
     console.log(user.show_adoptions);    

     // Get categories
     var condition = {};
     mongobasics.selectall("article_cat" , null ,condition,function(data) {
       categories = data;
       console.log('Article page categories');
       console.log(data);
       renderHtmlAfterCategoriesLoad();
     }, {}); 

   });
 });
 
  // Get pets by query data (filter)
  function renderHtmlAfterCategoriesLoad(){
    let condition = {};
    if(req.query.category){
      condition.category = req.query.category;
    }
    if(req.query.keyword){
      condition.keyword = req.query.keyword;
    }

    // CHANGE THIS TO RETURN PETS FILTERED
    mongobasics.selectall("article" , null ,condition,function(data) {
      articles = data;
      console.log('Article page articles');
      console.log(data);
      var header_image = "/images/repo/ronald.jpg";
      res.render('articles', { title: 'Articles' ,articles,categories,condition,header_image,user});
    });
  }
});

 /** GET by articleId*/
router.get('/:id([0-9]{1,10})', function(req, res) {

  var articleId = req.params.id;
  console.log('Get articles get by articleId');
  console.log(req.session);
  var categories = [];
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
  mongobasics.selectone("user",userID, function(data) {
    user = data[0];
    if(!user){
      console.log("\nres.redirect('/register')\n");
      res.redirect('/register');
      return;
    }
    
    let condition={ownerID: userID};
    mongobasics.selectall("pet",null,condition, function(data){
      user.adoptions = [];

      //Get pets to get adoptions
      pets = data;
      //Save pet adoptions to user.adoptions
      if(data){
        data.forEach(dataItem => {
          if(dataItem.adoptions.length>0){ 
            //set adoptions petname
             let i = 0;
              dataItem.adoptions.forEach(adoption => {
              dataItem.adoptions[i].petName = dataItem.name;              
              dataItem.adoptions[i].profile_img_url = dataItem.profile_img_url;
              i++;
            });
            user.adoptions=user.adoptions.concat(dataItem.adoptions);
          }
        });
      }

      //user adoptions
      user.show_adoptions= user.adoptions.slice(0,3);
      console.log('user.show_adoptions');
      console.log(user.show_adoptions);    

      // Get categories
      var condition = {};
      mongobasics.selectall("article_cat" , null ,condition,function(data) {
        categories = data;
        console.log('Articles page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {}); 

    });
  });
  

  function renderHtmlAfterCategoriesLoad(){   
      //pet = pets[petId-1];
        mongobasics.selectone('article',articleId, function(data) {
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
          res.render('article', { title: title,article,categories,header_image,user});
        }
      });
  }
});

 /** New article view render*/
router.get('/new', function(req, res) {

  var categories = [];
  var pet={};
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
  mongobasics.selectone("user",userID, function(data) {
    user = data[0];
    if(!user){
      console.log("\nres.redirect('/register')\n");
      res.redirect('/register');
      return;
    }
    
    let condition={ownerID: userID};
    mongobasics.selectall("pet",null,condition, function(data){
      user.adoptions = [];

      //Get pets to get adoptions
      pets = data;
      //Save pet adoptions to user.adoptions
      if(data){
        data.forEach(dataItem => {
          if(dataItem.adoptions.length>0){ 
            //set adoptions petname
             let i = 0;
              dataItem.adoptions.forEach(adoption => {
              dataItem.adoptions[i].petName = dataItem.name;              
              dataItem.adoptions[i].profile_img_url = dataItem.profile_img_url;
              i++;
            });
            user.adoptions=user.adoptions.concat(dataItem.adoptions);
          }
        });
      }

      //user adoptions
      user.show_adoptions= user.adoptions.slice(0,3);
      console.log('user.show_adoptions');
      console.log(user.show_adoptions);    

      // Get categories
      var condition = {};
      mongobasics.selectall("article_cat" , null ,condition,function(data) {
        categories = data;
        console.log('Article page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {}); 

    });
  });

  function renderHtmlAfterCategoriesLoad(){
    article = {_id : 0, profile_img_url:"/images/ronald.png"};
    var header_image = article.profile_img_url;
    res.render('article', { title: 'Articles - New',categories,article,header_image,user});
  }
 });


/** POST */
router.post('/', function(req, res) {

  console.log('req.body articles post');
  console.log(req.body);

  let maxrowID = 0;
  // mongobasics.getmaxid(function(data) {
  //   maxrowID = data[0].ID + 1;

    var vals = req.body;
    mongobasics.insertone("article" , vals, function(data) {
      categories = data;
      console.log('mongobasics.insertone');
      console.log(data);
  
      if (data){
        res.status(200).json(data);
      } else {      
        res.status(500).json({
          'message': 'Internal Error.'
        });
      }
    });
  // });
});


/** PUT */
router.put('/:id([0-9]{1,10})', function(req, res) {

  console.log('req.body articles put');
  console.log(req.body);

  let articleId = req.params.id;
  let condition = {"_id": articleId};
  var obj = req.body;

  mongobasics.updateone("article" ,condition, obj, function(data) {

    categories = data;
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
router.delete('/:id([0-9]{1,10})', function(req, res) {
  
  let articleId = req.params.id;
  let object = {_id:parseInt(articleId)};

  console.log('Delete article');
  mongobasics.delete("article", object, function(data){  
    console.log('mongobasics.delete');  
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
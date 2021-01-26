var express = require('express');
const connection = require('../config/connection');
const mongobasics = require('../config/mongobasics');
var router = express.Router();
var _article = require('../models/article.js');



/** GET */
router.get('/', function(req, res) {

  console.log('req.query pets get');
  console.log(req.query);

  // Get pets by query data (filter)  
  let conditions = {};
  
  conditions.category={};
  if(req.query.category){
    conditions.category = {
      categoryID: {$eq: req.query.category }           
    }
  }
  conditions.keyword={};
  if(req.query.keyword){  
    let tempcondition = new RegExp(req.query.keyword, "i");  
    conditions.keyword ={
      $or: [
      {name:  tempcondition },
      {short_desc:  tempcondition },
      {description: tempcondition }
    ]};
  }
  
  _article.find({$and: [
    conditions.category,
    conditions.keyword
    ]
    }, 
    function(err, result) {
      if (err) {
        console.log(err);
        return err;
      }

    articles = result;

    console.log("Article page articles");
    console.log(articles);

    var header_image = "/images/repo/ronald.jpg";
    let condition = req.query;
    let categories = res.article_categories;
    let user = res.user;
    res.render('articles', { title: 'Articles' ,articles,categories,condition,header_image,user});

  });
});

 /** GET by articleId*/
router.get('/:id([0-9]{1,10})', function(req, res) {

  var articleId = req.params.id;
  console.log('Get articles get by articleId');
  console.log(req.session);
 
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
      let categories = res.article_categories;
      let user = res.user;
      res.render('article', { title: title,article,categories,header_image,user});
    }
  });
});

 /** New article view render*/
router.get('/new', function(req, res) {

  article = {_id : 0, profile_img_url:"/images/ronald.png"};
  var header_image = article.profile_img_url;
  let categories = res.article_categories;
  let user = res.user;
  res.render('article', { title: 'Articles - New',categories,article,header_image,user});

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
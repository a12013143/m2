var express = require('express');
var router = express.Router();
var mongobasics = require('../confignosql/mongobasics.js');
var _analytics = require('../modelsnosql/analytics.js');
var _pet = require('../modelsnosql/pet.js');


/*# GET */
router.get('/', function(req, res) {

  console.log('req.query analytics get');
  console.log(req.query);

  // Get analytics by query data
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
 // HEADER USER
 var userID = req.query.userId;
 if(!userID){
   userID=1;
 }
 var user = {_id:userID}

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
     
     renderHtmlAfterLoad();

   });
 });

  function renderHtmlAfterLoad(){
    console.log('renderHtmlAfterLoad');

    var condition = {};
    if(req.query.start_date){
      condition.start_date = req.query.start_date;
    }
    if(req.query.end_date){
      condition.end_date = req.query.end_date;
    }

     _analytics.aggregate(
       [{
         $group:{
         _id: "$url",
         time:{$sum:"$time"},
         created_at:{$max:"$created_at"},
         visits:{$sum:1}
        }}],function(err,data) {
        analytics = data;
        console.log('Analytics page analytics');
        console.log(data);
        var header_image = "/images/repo/petcare-large.jpg";
        res.render('analytics', { title: 'Analytics' ,analytics,condition,header_image,user});
    });
  }
  
  
});

/** GET One*/
// Redirect to all

/** GET Pet Analytics */
router.get('/pets/', function(req, res) {

  console.log('req.query pets get');
  console.log(req.query);

  var categories = [];  
  var userID = req.query.userId;
  if(!userID){
    userID=1;
  }
  var user = {ID:userID}
  mongobasics.selectone("user",userID, function(data) {
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
      
      // Get categories
      mongobasics.selectall("pet_category" , function(data) {
        categories = data;
        console.log('Pets page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {});          
    });
  });

  // Get pets by query data
  function renderHtmlAfterCategoriesLoad(){
    var condition = {};
    if(req.query.category){
      condition.category = req.query.category;
    }
    if(req.query.neutered){
      condition.neutered = req.query.neutered;
    }
    if(req.query.keyword){
      condition.keyword = req.query.keyword;
    }

    console.log(condition);
    console.log('condition');
    
    _pet.analytics("pet" , function(data) {
      analytics = data;
      console.log('Pet analytics page analytics');
      console.log(analytics);
      var header_image = "/images/repo/petcare-large.jpg";
      res.render('petsanalytics', { title: 'Pets analytics' ,analytics,categories,condition,header_image,user});
    }, condition);
  }
});


/** POST */
router.post('/', function(req, res) {

  console.log('req.body analytics post');
  console.log(req.body);
  
    var vals = req.body;
    mongobasics.insertone("analytics" , vals, function(data) {  
      if (data){
        res.status(200).json(data);
      } else {      
        res.status(500).json({
          'message': 'Internal Error.'
        });
      }
    });
});



module.exports = router;
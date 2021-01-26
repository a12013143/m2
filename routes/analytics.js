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

    var conditions={};
    conditions.created_at={};

    // if(req.query.start_date){
    //   conditions.created_at.$gte=new Date(req.query.start_date);
    // }

    // if(req.query.end_date){
    //   conditions.created_at.$lte=new Date(req.query.end_date);
    // }

    console.log("conditions");
    console.log(conditions);

     _analytics.aggregate(
       [
        {
          $match:conditions.created_at
        } ,
        {
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
        let condition = req.query;
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
      mongobasics.selectall("pet_category" , null ,condition,function(data) {
        categories = data;
        console.log('Pets page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {}); 

    });
  });

  // Get pets by query data
  function renderHtmlAfterCategoriesLoad(){

    let conditions = {};
      
    conditions.neutered={};
    if(req.query.neutered){
      conditions.neutered = {
        neutered: {$eq: parseInt(req.query.neutered) }           
      }
    }

    conditions.category={};
    if(req.query.category){
      conditions.category = {
        categoryID: {$eq: parseInt(req.query.category) }           
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

    console.log("conditions");
    console.log(conditions.keyword);
   
    _pet.aggregate(
      [{ 
        $match :{$and:  [conditions.neutered,conditions.keyword,conditions.category]}
       }, 
      {$lookup:
            {
              from: "pet_category",
              localField: "categoryID",
              foreignField: "_id",
              as: "categories"
            }  },
      { $unwind :  "$categories" },
      {
        $group:{
        _id: {
          status:{$cond: { if: {$ne:["$adoptions",[]]},then:"$adoptions.status",else:"No adoption requests"}}, categoryID : "$categoryID",
          category : "$categories.name",
          fans:{$size: "$favourited_by"},
          adopters:{$cond: { if: {$ne:["$adoptions",[]]},then:{$size:"$adoptions"},else:null}},
        },
        favourite:{ $sum:{$cond: { if: {$ne: [ "$favourited_by", [] ]}, then: 1, else: 0 } } },
        adoptions:{$sum:1} ,
       }
      } ],function(err,data) {

       var analytics=data;
       console.log('Analytics page analytics');
       console.log(data);

       let condition = req.query;
       var header_image = "/images/repo/petcare-large.jpg";
       res.render('petsanalytics', { title: 'Analytics' ,analytics,categories,condition,header_image,user});
   });

   


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
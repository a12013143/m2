var express = require('express');
const mongobasics = require('../confignosql/mongobasics');
var router = express.Router();
var _pet = require('../modelsnosql/pet.js');



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
      mongobasics.selectall("pet_category" , null ,condition,function(data) {
        categories = data;
        console.log('Pets page categories');
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
    mongobasics.selectall("pet" , null ,condition,function(data) {
      pets = data;
      console.log('Pets page pets');
      console.log(data);
      var header_image = "/images/repo/ronald.jpg";
      res.render('pets', { title: 'Pets' ,pets,categories,condition,header_image,user});
    });
  }
});

/** GET by petID */
router.get('/:petId', function(req, res) {

  var petId = req.params.petId;
  console.log('Get pets get by petid');
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
      mongobasics.selectall("pet_category" , null ,condition,function(data) {
        categories = data;
        console.log('Pets page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {}); 

    });
  });

  function renderHtmlAfterCategoriesLoad(){
   
    if(petId == "new"){
      pet = {ID : 0, profile_img_url:"/images/pawprint-blue.png"};
      var header_image = pet.profile_img_url;
      res.render('pet', { title: 'Pets - New',categories,pet,header_image,user});
    }else{
      //pet = pets[petId-1];
        mongobasics.selectone('pet',petId, function(data) {
        pet = data[0];
        console.log('pet---');
        console.log(pet);
        if (data.err){
          res.status(500).json({
            'message': 'Internal Error.'
          });
        } else {
          var header_image = '/images/petcare-large.jpg';
          var title = 'Pet not found';
          if(pet){
            header_image = pet.profile_img_url;
            title = pet.name;
          }
          res.render('pet', { title: title,pet,categories,header_image,user});
        }
        
      });
    }
  }
 
});

/** POST */
router.post('/', function(req, res) {
  console.log('req.body pets post');
  console.log(req.body);
  
  let maxrowID = 0;
  _pet.getmaxid(function(data){
    maxrowID = (data[0].ID) + 1;
    
    var vals = req.body;
    var keys = Object.keys(req.body);
    var i =0;
    keys.forEach(function(key){
      var str = ['name','address','short_desc','description','profile_img_url'];
        if(!vals[key] && !str.includes(key) ){
          vals[key] = 'null';
        }
    }) 

    let querytemp = '(' + maxrowID + ', ' + vals.ownerID +', "' + vals.name + '","' + vals.address + '", ' + vals.categoryID + ', ' + vals.neutered + ', ' + vals.age_year + ', ' + vals.age_month + ', "' + vals.short_desc + '", "' + vals.description + '","' + vals.created_at + '","' + vals.updated_at + '", ' + /*req.body.profile_img_url + '"'*/ '"/images/repo/ronald.jpg"';
    console.log('querytemp')
    console.log(querytemp)
    mongobasics.insertone("pet" , querytemp, function(data) {
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

  });

  // Move this to model
  // let querytemp = '(' + maxrowID + ', ' + /*req.body.user_id*/'1' +', "' + req.body.pet_name + '", ' + req.body.category + ', ' + req.body.neutered + ', ' + req.body.age_years + ', ' + req.body.age_months + ', "' + req.body.short_content + '", "' + req.body.content + '", ' + /*req.body.profile_img_url + '"'*/ '"/images/repo/ronald.jpg"';
  // mongobasics.insertone("pet", querytemp)
  
});

/** PUT */
router.put('/:petId', function(req, res) {

  console.log('req.body pets put');
  console.log(req.body);

  var petId = req.body.ID;
  var condition = 'ID = ' + petId;

  var obj = req.body;

  mongobasics.updateone("pet" , petId, obj, function(data) {
    categories = data;
    console.log('mongobasics.updateone');
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
  let petId = req.params.id;
  let condition = 'ID = ' + petId;

  console.log('Delete pet');
  mongobasics.delete("pet", condition, function(data){  
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


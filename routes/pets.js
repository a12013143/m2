var express = require('express');
const sqlitebasics = require('../config/sqlitebasics');
var router = express.Router();
var _pet = require('../models/pet.js');


// // hardcoded user data
// var user = {
//   id: 1,
//   name: "Grese Hyseni",
//   email:"hysenigrese@gmail.com",
//   password: "hashvalue",
//   phone:"06763949302",
//   address:"Vienna, Austria",
//   profile_img_url: "/images/repo/user.png"
// };

// //hardcoded data
// user.adoptions =[{
//   id: 1,
//   pet_id: 3,
//   pet: {
//     id: 3,
//     pet_name: "Roko",
//     profile_img_url: "/images/repo/roko.jpg"},
//   user_id: 2,
//   user : {
//     id: 2,
//     name: "Hannah Poor",
//     profile_img_url:"/images/repo/user.png"},
//   status: "Initiated",
//   message: "I would like to adopt this lovely pet."
// },{
//   id: 2,
//   pet_id: 2,
//   pet: {
//     id: 3,
//     pet_name: "Ron",  
//     profile_img_url: "/images/repo/ronald.jpg"},
//   user_id: 3,
//   user : {
//     id: 3,
//     name: "User User",
//     profile_img_url:"/images/repo/user.png"},
//   status: "In progress",
//   message: "Hi, I am interested to adopt this pet."
// }];


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
      
      // Get categories
      var condition = {};
      sqlitebasics.selectall("pet_category" , function(data) {
        categories = data;
        console.log('Pets page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {});          
    });
  });

  // Get pets by query data
  function renderHtmlAfterCategoriesLoad(){
    if(req.query.category){
      condition.category = req.query.category;
    }
    if(req.query.keyword){
      condition.keyword = req.query.keyword;
    }
    _pet.selectall("pet" , function(data) {
      pets = data;
      console.log('Pets page pets');
      console.log(data);
      var header_image = "/images/repo/ronald.jpg";
      res.render('pets', { title: 'Pets' ,pets,categories,condition,header_image,user});
    }, condition);
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
      sqlitebasics.selectall("pet_category" , function(data) {
        categories = data;
        console.log('Pets page categories');
        console.log(data);
        renderHtmlAfterCategoriesLoad();
      }, {});
          
    });
  });

  function renderHtmlAfterCategoriesLoad(){
   
    let temp = petId;
    if(petId == "new"){
      pet = {ID : 0, profile_img_url:"/images/pawprint-blue.png"};
      var header_image = pet.profile_img_url;
      res.render('pet', { title: 'Pets - New',categories,pet,header_image,user});
    }else{
      //pet = pets[petId-1];
      _pet.selectone(temp, function(data) {
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
    sqlitebasics.insertone("pet" , querytemp, function(data) {
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

  // Move this to model
  // let querytemp = '(' + maxrowID + ', ' + /*req.body.user_id*/'1' +', "' + req.body.pet_name + '", ' + req.body.category + ', ' + req.body.neutered + ', ' + req.body.age_years + ', ' + req.body.age_months + ', "' + req.body.short_content + '", "' + req.body.content + '", ' + /*req.body.profile_img_url + '"'*/ '"/images/repo/ronald.jpg"';
  // sqlitebasics.insertone("pet", querytemp)
  
});

/** PUT */
router.put('/:petId', function(req, res) {

  console.log('req.body pets put');
  console.log(req.body);

  var petId = req.body.ID;
  var condition = 'ID = ' + petId;

  var columns = Object.keys(req.body);
  var values = Object.values(req.body);

  sqlitebasics.updateone("pet" , columns, values, condition, function(data) {
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
  let petId = req.params.id;
  let condition = 'ID = ' + petId;

  console.log('Delete pet');
  sqlitebasics.delete("pet", condition, function(data){  
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


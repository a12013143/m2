var express = require('express');
const sqlitebasics = require('../config/sqlitebasics');
var _pet = require('../models/pet.js');
var _adoption = require('../models/adoption.js');
var router = express.Router();

// -- END TEST MYSQL, delete after --------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('req.query pets get');
  console.log(req.query);

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
      renderHtmlAfterUserLoad();
    });
  });

  //Get pet statistics
  var stats = {};

  // Get pets by query data
  function renderHtmlAfterUserLoad(r){
    sqlitebasics.selectall("pet", function(data) {
      pets = data;
      pets=pets.slice(0,3);
      console.log('Pets page');
      //console.log(pets);
      var header_image = "/images/repo/petcare-large.jpg";
      res.render('index', { title: 'FosterPet - Home ' ,pets, stats,header_image,user});
    });
}

});



/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log('Login page');
  res.render('login', {title:'Login'});
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  console.log('Register page');
  res.render('register', {title:'Register'});
});

/* GET profile page. */
router.get('/profile/:userId', function(req, res, next) {
  console.log('Profile page');

  var userID = req.params.userId;
  if(!userID){
    userID=1;
  }
  user = {ID:userID}
  sqlitebasics.selectone("user",userID, function(data) {
    user = data[0];
    console.log('user');
    console.log(user);
    condition={userID};
    _adoption.selectall("adoption",condition, function(data) {
      user.adoptions = data;
      user.show_adoptions = user.adoptions.slice(0,3);
      console.log('user.show_adoptions');
      console.log(user.show_adoptions);
      renderHtmlAfterUserLoad();
    });
  });


  function renderHtmlAfterUserLoad(){
    var show_adoptions_param = req.query.showAdoptions;
    var edit_param = req.query.edit;
    res.render('profile', {title:user.name,user,show_adoptions_param,edit_param});
  }
  
}); 



/* Insert initial data*/
router.post('/initialInsert', function(req, res, next) {
  console.log('Insert initial data');
  sqlitebasics.initialInsert("", function(data) {
    res.status(200).json(data);
  });
}); 




module.exports = router;

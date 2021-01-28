var express = require('express');
const mongobasics = require('../config/mongobasics');
var router = express.Router();
var _pet = require('../models/pet.js');
var ObjectId = require('mongoose').Types.ObjectId; 



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

      console.log("\n\nconditions");
      console.log(conditions);
      
      _pet.find({$and: [
        conditions.category,
        conditions.keyword
        ]
        }, function(err, result) {
            if (err) {
                console.log(err);
            return err;
        }
        pets = result;
  
        // console.log("Pets page pets");
        // console.log(pets);
        var header_image = "/images/repo/ronald.jpg";
        let condition = req.query;
        let categories = res.categories;
        let user = res.user;
        res.render('pets', { title: 'Pets' ,pets,categories,condition,header_image,user});

    });

});

/** GET by petID */
router.get('/:id', function(req, res) {

  if(req.params.id=="new"){
    pet = {new: 0, profile_img_url:"/images/pawprint-blue.png"};
    var header_image = pet.profile_img_url;
    let categories = res.categories;
    let user = res.user;
    res.render('pet', { title: 'Pets - New',categories,pet,header_image,user});
  }

  var petId = req.params.id;
  console.log('Get pets get by petid');
  console.log(req.user);

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
          pet.favourited_by =  pet.favourited_by.length;
          pet.applications = pet.adoptions.length;
        }
        let categories = res.categories;
        let user = res.user;

        pet.new=1;
        res.render('pet', { title: title,pet,categories,header_image,user});
      }
      
    });
});



/** POST */
router.post('/', function(req, res) {

  // console.log('req.body analytics post');
  // console.log(req.body);
  
    var vals = req.body;

      mongobasics.insertone("pet" , vals, function(data) {  
        if (data){
          res.status(200).json(data);
        } else {      
          res.status(500).json({
            'message': 'Internal Error.'
          });
        }
      });
    


});


/** PUT */

/** PUT */
router.put('/:id', function(req, res) {

  console.log('req.body pet put');
  console.log(req.body);

  let petId = req.params.id;
  let condition = {"ID": petId};
  var update = req.body;

  
  if(update.favourited_by){

    console.log('update.favourited_by');
    console.log(update.favourited_by);

    update = { $push: { favourited_by:update.favourited_by}};
  }

  mongobasics.updateone("pet" ,condition, update, function(data) {
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
  let condition = {ID:parseInt(petId)};

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


var express = require('express');
var router = express.Router();
var _pet = require('../models/pet.js');

const mongobasics = require('../config/mongobasics');


/*# GET */
router.get('/', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
});

router.get('/:id([0-9]{1,10})', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
});


/** POST new adoption (update pet) */
router.put('/', function(req, res) {

  console.log('req.body adoptions put');
  console.log(req.body);

  let petID = req.body.petID;
  let userID = req.body.userID;
  delete(req.body.petID);
  let adoption = req.body;

  let conditions = {_id:petID,'adoptions.userID': { $ne: userID }, 'adoptions.status': { $ne: "Approved" }};
  let update =  { $push: { adoptions:adoption}}

  console.log(" findOneAndUpdate conditions");
  console.log(conditions);
  console.log(req.body);
  console.log(update);
  
  _pet.findOneAndUpdate(conditions,update,function(err,data) {
    console.log('findOneAndUpdate data');
    console.log(data);
    console.log('findOneAndUpdate update');
    console.log(update);
    if (err){
      console.log('err');
      console.log(err);
      res.status(500).json({
        'message': 'Internal Error.'
      });
    } else if(!data){
      res.status(500).json({
        'message': 'You have already applied for adoption.'
      });
    } else {      
      res.status(200).json(data);
    }
  });
});

/** Update adoption status */
router.put('/:id([0-9]{1,10})', function(req, res) {

  console.log('req.body adoptions put');
  console.log(req.body);

  let petId = req.body.petID;
  let adoptionId = req.params.id;
  let status = req.body.status;

  let conditions = {"_id":petId, "adoptions._id":adoptionId};
  let update =  { $set: { "adoptions.$.status":status }}

  console.log(" findOneAndUpdate conditions");
  console.log(conditions);
  console.log(req.body);
  
  _pet.findOneAndUpdate(conditions,update,function(err,data) {
    console.log('findOneAndUpdate data');
    console.log(data);
    console.log('findOneAndUpdate update');
    console.log(update);
    if (err){
      console.log('err');
      console.log(err);
      res.status(500).json({
        'message': 'Internal Error.'
      });
    } else {      
      res.status(200).json(data);
    }
  });
});



/** DELETE */
router.delete('/:id', function(req, res) {
  let adoptionId = req.params.id;
  let condition = 'ID = ' + adoptionId;

  console.log('Delete adoption');
  mongobasics.delete("adoption", condition, function(data){  
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
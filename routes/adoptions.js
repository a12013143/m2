var express = require('express');
var router = express.Router();
var _pet = require('../models/pet.js');

const mongobasics = require('../confignosql/mongobasics');


/*# GET */
router.get('/', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
});

router.get('/:id([0-9]{1,10})', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
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





/** PUT */
router.put('/:ID', function(req, res) {

  console.log('req.body adoptions put');
  console.log(req.body);

  var adoptionId = req.body.ID;
  var condition = 'ID = ' + adoptionId;

  var columns = Object.keys(req.body);
  var values = Object.values(req.body);

  mongobasics.updateone("adoption" , columns, values, condition, function(data) {
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
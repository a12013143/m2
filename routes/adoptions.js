var express = require('express');
var router = express.Router();
var _adoption = require('../models/adoption.js');

const connection = require('../config/connection');
const sqlitebasics = require('../config/sqlitebasics');

// hardcoded user data
var user = {
  id: 1,
  name: "Grese Hyseni",
  email:"hysenigrese@gmail.com",
  password: "hashvalue",
  phone:"06763949302",
  address:"Vienna, Austria",
  profile_img_url: "/images/repo/user.png"
};

//hardcoded data
adoptions =[{
  id: 1,
  pet_id: 3,
  pet: {
    id: 3,
    pet_name: "Roko",
    profile_img_url: "/images/repo/roko.jpg"},
  user_id: 2,
  user : {
    id: 2,
    name: "Hannah Poor",
    profile_img_url:"/images/repo/user.jpg"},
  status: "Initiated",
  message: "I would like to adopt this lovely pet."
},{
  id: 2,
  pet_id: 2,
  pet: {
    id: 3,
    pet_name: "Ron",  
    profile_img_url: "/images/repo/ronald.jpg"},
  user_id: 3,
  user : {
    id: 3,
    name: "User User",
    profile_img_url:"/images/repo/user.jpg"},
  status: "In progress",
  message: "Hi, I am interested to adopt this pet."
}];

user.adoptions=adoptions;


/*# GET */
router.get('/', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
});

router.get('/:adoptionId', function(req, res) {
  res.redirect('/profile?showAdoptions=1');
});


/** POST */
router.post('/', function(req, res) {

  console.log('req.body adoptions post');
  console.log(req.body);

  let maxrowID = 0;
  _adoption.getmaxid(function(data) {
    maxrowID = data[0].ID + 1;

    var vals = req.body;
    var keys = Object.keys(req.body);
    var i =0;
    keys.forEach(function(key){;
      var str = ['description','status'];
        if(!vals[key] && !str.includes(key) ){
          vals[key] = 'null';
        }
    }) 

    //1, 1, 1, "Description", "Approved"
    //ID, userID INT, petID INT, description TEXT, status TEXT, created_at, updated_at
    let querytemp = '(' + maxrowID + ', ' + vals.userID +', ' + vals.petID + ', "' + vals.description + '", "Initiated", "' + vals.created_at + '", "' + vals.updated_at+ '"';
    console.log('querytemp')
    console.log(querytemp)
    sqlitebasics.insertone("adoption" , querytemp, function(data) {
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
});



/** PUT */

/** PUT */
router.put('/:ID', function(req, res) {

  console.log('req.body adoptions put');
  console.log(req.body);

  var adoptionId = req.body.ID;
  var condition = 'ID = ' + adoptionId;

  var columns = Object.keys(req.body);
  var values = Object.values(req.body);

  sqlitebasics.updateone("adoption" , columns, values, condition, function(data) {
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
  let adoptionId = req.params.id;
  let condition = 'ID = ' + adoptionId;

  console.log('Delete adoption');
  sqlitebasics.delete("adoption", condition, function(data){  
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
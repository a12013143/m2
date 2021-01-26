var express = require('express');
const connection = require('../config/connection');
const mongobasics = require('../config/mongobasics');
var _pet = require('../models/pet.js');
var router = express.Router();

// -- END TEST MYSQL, delete after --------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('req.query pets get');
  console.log(req.query);

  // Get pets by query data
  let limit = 3;
  let condition={};
  mongobasics.selectall("pet",limit,condition, function(data){
    pets = data;
    // console.log('Latest 3 pets data');
    // console.log(pets);
    var header_image = "/images/repo/petcare-large.jpg";
    let user = res.user;
    let stats= {};
    res.render('index', { title: 'FosterPet - Home ' ,pets, stats,header_image,user});
  });

});



/* GET login page. */
router.get('/login', function(req, res, next) {
  console.log('Login page - In developement!');
  res.render('login', {title:'Login'});
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  console.log('Register page');
  res.render('register', {title:'Register - In developement!'});
});

/* GET profile page. */
router.get('/profile/:userId?', function(req, res, next) {

  var show_adoptions_param = req.query.showAdoptions;
  var edit_param = req.query.edit;
  let user = res.user;
  res.render('profile', {title:user.name,user,show_adoptions_param,edit_param});
  
}); 



/* Insert initial data*/
router.post('/initialInsert', function(req, res, next) {

  console.log('Insert initial data');
  connection.migrateFromSqlite( function(data) {
    res.status(200).json(data);
  });
  // mongobasics.initialInsert("", function(data) {
  //   res.status(200).json(data);
  // });
}); 


/* Insert initial data*/
router.delete('/dropCollections', function(req, res, next) {
  console.log('Drop collections');
  connection.dropCollections( function() {
    res.status(200).json(data);
  });

}); 

/* Insert initial data*/
router.get('/error', function(req, res, next) {
  next(createError(404));
}); 



module.exports = router;

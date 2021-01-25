var express = require('express');
const connection = require('../confignosql/connection');
const mongobasics = require('../confignosql/mongobasics');
var _pet = require('../modelsnosql/pet.js');
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
  mongobasics.selectone("user",userID, function(data) {
    user = data[0];
    if(!user){
      console.log("\nres.redirect('/register')\n");
      res.redirect('/register');
      return;
    }
     
    console.log('user mongo');
    console.log(user);

    let condition={ownerID: userID};
    mongobasics.selectall("pet",null,condition, function(data){
      user.adoptions = [];

      // Save data to pets
      // console.log('User pet data');
      // console.log(data);
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

      user.show_adoptions= user.adoptions.slice(0,3);
      console.log('user.show_adoptions');
      console.log(user.show_adoptions);
      renderHtmlAfterUserLoad();
    });

  });

  //Get pet statistics
  var stats = {};
  // Get pets by query data
  function renderHtmlAfterUserLoad(){
    let limit = 3;

    let condition={};
    mongobasics.selectall("pet",limit,condition, function(data){
      pets = data;
      // console.log('Latest 3 pets data');
      // console.log(pets);
      var header_image = "/images/repo/petcare-large.jpg";
      res.render('index', { title: 'FosterPet - Home ' ,pets, stats,header_image,user});
    });
  
}

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
  console.log('Profile page');

  var userID = req.params.userId;
  if(!userID){
    userID=1;
  }
  user = {ID:userID}
  mongobasics.selectone("user",userID, function(data) {
    user = data[0];
    console.log('user');
    console.log(user);

    let condition={ownerID: userID};
    mongobasics.selectall("pet",null,condition, function(data){
      user.adoptions = [];

      // Save data to pets
      // console.log('User pet data');
      // console.log(data);
      pets = data;

      //Save pet adoptions to user.adoptions
      if(data){
        data.forEach(dataItem => {
          if(dataItem.adoptions.length>0){   
            
            //set adoptions petname
             let i = 0;
              dataItem.adoptions.forEach(adoption => {
              dataItem.adoptions[i].petName = dataItem.name;
              dataItem.adoptions[i].pet_profile_img_url = dataItem.profile_img_url;
              dataItem.adoptions[i].profile_img_url = user.profile_img_url;
              i++;
            });

            user.adoptions=user.adoptions.concat(dataItem.adoptions);
          }
        });
      }

      user.show_adoptions=  user.adoptions;
      console.log('user.adoptions');
      console.log(user.adoptions);
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



module.exports = router;

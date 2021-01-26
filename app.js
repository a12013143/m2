var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var connection = require('./confignosql/connection');
var indexRouter = require('./routes/index');
var petsRouter = require('./routes/pets');
var articlesRouter = require('./routes/articles');
var adoptionsRouter = require('./routes/adoptions');
var analyticsRouter = require('./routes/analytics');
var usersRouter = require('./routes/users');

var mongobasics = require('./confignosql/mongobasics');

var app = express();

/** Handlebars helpers */
var hbs = require('hbs');

//equal
hbs.registerHelper('eq', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a == b) ? next.fn(this) : next.inverse(this);
});

// greater than
hbs.registerHelper('gt', function( a, b ){
	var next =  arguments[arguments.length-1];
	return (a > b) ? next.fn(this) : next.inverse(this);
});

/** Handlebars partials */
hbs.registerPartial('petedit', '{{prefix}}');


// console.log('hbs.helpers');
// console.log(hbs.helpers);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(function (req, res, next) {

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

     // Get categories
     var condition = {};
     mongobasics.selectall("pet_category" , null ,condition,function(data) {
       res.categories = data;
     }); 

     mongobasics.selectall("article_cat" , null ,condition,function(data) {
      res.article_categories = data;
    }); 

    res.user = user;
    next();

   });
 });


  // Item.count({"author.id":req.user.id}, (err, itemCount)=>{
  //    if(err){
         
  //    } else {
  //       req.Count = JSON.stringify(itemCount);
       
  //    }
  // });    
});

app.use('/', indexRouter);
app.use('/pets', petsRouter);
app.use('/articles', articlesRouter);
app.use('/pets/:petId([0-9]{1,10})/adoptions', adoptionsRouter);
app.use('/analytics', analyticsRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/error');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500 );
  res.render('error');
  
  
});

module.exports = app;

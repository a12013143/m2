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

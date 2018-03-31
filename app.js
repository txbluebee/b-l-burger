var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
var engine = require('ejs-locals');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var dashboardRouter = require('./routes/dashboard');

var app = express();
require('dotenv').config;
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(flash());

const adminCheck = (req, res, next)=>{
  if (req.session.uid === process.env.ADMIN_UID){
    return next();
  }
  res.redirect('/menu');
}

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

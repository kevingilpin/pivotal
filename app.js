var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const expressSession = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(expressSession);
const credentials = require('./config/credentials');

var app = express();

// set up handlebars view engine
var exphbs = require("express-handlebars").create({
  defaultLayout: "dashboard",
  extname: '.hbs',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine(".hbs", exphbs.engine);
app.set("view engine", ".hbs");
app.set('views', path.join(__dirname, 'views'));


//Mongo database
require('./service/database')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
app.use(expressSession({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

// Require in all passport service
const passportService = require('./service/passport.js')

// Routers
var indexRouter = require('./routes/index')(passport);
app.use('/', indexRouter);

var ceRouter = require('./routes/ce');
app.use('/ce', ceRouter);

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
  res.render('error', { layout: "dashboard" });
});

module.exports = app;

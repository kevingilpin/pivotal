const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require("express-handlebars");
const passport = require('passport');
const passportService = require('./service/passport.js');
const expressSession = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(expressSession);
const credentials = require('./config/credentials');
require('./service/database');

const indexRouter = require('./routes/index')(passport);
const ceRouter = require('./routes/ce');

const app = express();

// Redirect to HTTPS
app.use(function (req, res, next) {
  // Insecure request?
  if (req.get('x-forwarded-proto') == 'http') {
      // Redirect to https://
      return res.redirect('https://' + req.get('host') + req.url);
  }

  next();
});

// set up handlebars view engine
const hbs = exphbs.create({
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
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set('views', path.join(__dirname, 'views'));


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

// Routers
app.use('/', indexRouter);
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

const express = require('express');
const router = express.Router();
const flash = require("connect-flash");
router.use(flash());

// As with any middleware it is quintessential to call next()
// if the user is authenticated
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated() && req.user.company === 'ce') {
    console.log(req.user);
    console.log(req.session);
    return next();
  }
  res.send({access: 'denied'});
}

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });
 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
  }));
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('signup',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

    /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });
  
 
  return router;
}

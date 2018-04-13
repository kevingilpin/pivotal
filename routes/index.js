const express = require('express');
const router = express.Router();
const flash = require("connect-flash");
router.use(flash());

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect(req.user.company);
    } else {
      req.session.destroy(function() {
        return res.render("signin", { layout: null });
      });
    }
  });
 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
      failureRedirect: '/',
      failureFlash : true 
    }), function(req, res) {
      res.redirect(req.user.company);
    }
  );
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('signup',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: 'ce/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}

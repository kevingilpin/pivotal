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
 
  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });
  
 
  return router;
}

const express = require('express');
const router = express.Router();
const flash = require("connect-flash");
router.use(flash());

// As with any middleware it is quintessential to call next()
// if the user is authenticated
const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated() && req.user.company === 'ce') {
    return next();
  }
  res.send({access: 'denied'});
}

/* GET Home Page */
router.get('/', isAuthenticated, function(req, res){
  res.render('ce/home', {company:'Commissions Early'}); 
});
  
/* GET Viz Page */
router.get('/dashboard', isAuthenticated, function(req, res){
  res.render('ce/vis', {company:'Commissions Early'}); 
});
 
module.exports = router;

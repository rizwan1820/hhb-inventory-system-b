var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../config/authenticte');

/* GET users listing. */
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: err.message });
    }
    else {
      user.save()
      .then(() => {
          passport.authenticate('local', { session: false })(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!', userId: user._id});
        });
      })
      .catch((error) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: error.message });
      });
    }
  });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  res.redirect('/');
});

module.exports = router;

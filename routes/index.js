var express = require('express');
var router = express.Router();
var authenticate = require('../config/authenticte');

/* GET home */
router.get('/', authenticate.verifyUser, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

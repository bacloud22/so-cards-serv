var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET card page. */
router.get('/c', function(req, res, next) {
  res.render('card', { title: 'Express' });
});

module.exports = router;

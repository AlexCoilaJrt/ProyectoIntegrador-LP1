var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/oferta-laboral-add', function(req, res, next) {    
  res.render('admin/oferta-laboral-add');
})

module.exports = router;



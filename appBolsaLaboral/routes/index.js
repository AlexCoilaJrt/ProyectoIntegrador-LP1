var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',function(req,res,next){
  correo=req.body.correo;
  password=req.body.password;
  //console.log(email);
  dbConn.query("SELECT * FROM users WHERE correo='"+correo+"' AND password='"+password+"'",function(err,rows){
    if(err) {
        req.flash('error', err);  
        console.log(err);
    } else {
        console.log(rows);
        if(rows.length){
          req.session.idu=rows[0]["id"];
          req.session.user=rows[0]["fullname"];
          req.session.admin=true;      
          res.redirect("/admin");
        }else{
          //req.flash('success', 'El usuario no existe'); 
          res.redirect("/");
        }
    }
  });
});

router.get('/admin', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/index');
  }else{
    res.redirect("/login");
  }
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");
});

router.get('/nosotros', function(req, res, next) {
  res.render('admin/nosotros-ruta');
});

router.get('/oferta-laboral-add', function(req, res, next) {    
  res.render('admin/oferta-laboral-add');
})

router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM oferta_laboral ORDER BY ol_id DESC', function(err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('index', { data: [] }); // Pasar data como un array vacío si hay un error en la consulta
    } else {
      console.log(rows); // Verificar los datos en la consola
      res.render('index', { data: rows }); // Pasar los datos de la consulta como data
    }
  });
});



router.post('/postular', function(req, res) {  
  let nombre = req.body.eg_nombre;
  let paterno = req.body.eg_paterno;
  let materno = req.body.eg_materno;
  let nacimiento = req.body.eg_fecha_nacimiento ? new Date(req.body.eg_fecha_nacimiento) : null;
  let genero = req.body.eg_genero;
  let carrera = req.body.eg_carrera;

  var form_data = {
    eg_nombre: nombre,
    eg_paterno: paterno,
    eg_materno: materno,
    eg_fecha_nacimiento: nacimiento,
    eg_genero: genero,
    eg_carrera: carrera,
  }

  dbConn.query('INSERT INTO egresados SET ?', form_data, function(err, result) {
      if (err) {
          req.flash('error', err)
          console.log(form_data);
      } else {                
          req.flash('success','Oferta agregada correctamente');
          res.redirect('../');
      }
  })

})

router.get('/cv', function(req, res, next) {
  res.render('admin/cv');
});
router.get('/oferta-laboral', function(req, res, next) {
  dbConn.query('SELECT * FROM oferta_laboral ORDER BY ol_id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          res.render('admin/oferta-laboral-list',{data:''});   
      } else {
          res.render('admin/oferta-laboral-list',{data:rows});
      }
  });
}); 

module.exports = router;

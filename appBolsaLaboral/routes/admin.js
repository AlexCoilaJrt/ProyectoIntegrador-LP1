var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/categories', function(req, res, next) {
    dbConn.query('SELECT * FROM categorias ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('admin/categories-list',{data:''});   
        } else {
            res.render('admin/categories-list',{data:rows});
        }
    });
});

router.get('/categorias-add', function(req, res, next) {    
    res.render('admin/categories-add');
})

router.post('/categorias-add', function(req, res, next) {    
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;

    var form_data = {
        nombre: nombre,
        descripcion: descripcion
    }

    dbConn.query('INSERT INTO categorias SET ?', form_data, function(err, result) {
        if (err) {
            req.flash('error', err)
        } else {                
            req.flash('success','Categoria agregada correctamente');
            res.redirect('../admin/categories');
        }
    })

})

router.get('/categorias-edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM categorias WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'No se encontro el registro con el id = ' + id)
            res.redirect('/categorias')
        }
        else {
            res.render('admin/categorias-edit', {
                id: rows[0].id,
                nombre: rows[0].nombre,
                descripcion: rows[0].descripcion
            })
        }
    })
})

router.post('/categorias-edit/:id', function(req, res, next) {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let descripcion = req.body.descripcion;

    var form_data = {
        nombre: nombre,
        descripcion: descripcion
    }
    // update query
    dbConn.query('UPDATE categorias SET ? WHERE id = ' + id, form_data, function(err, result) {
        if (err) {
            req.flash('error', err)
        } else {
            req.flash('success', 'categoria editada correctamente');
            res.redirect('../../admin/categories');
        }
    })
    
})

router.get('/categorias-del/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM categorias WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/categories')
        } else {
            req.flash('success', 'categoria eliminada! ID = ' + id)
            res.redirect('../categories')
        }
    })
})

router.get('/empresas', function(req, res, next) {
    dbConn.query('SELECT * FROM empresas ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('admin/empresas-list',{data:''});   
        } else {
            res.render('admin/empresas-list',{data:rows});
        }
    });
});

router.get('/postular', function(req, res, next) {
    res.render('admin/postular');
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


router.get('/oferta-laboral-add', function(req, res, next) {    
    res.render('admin/oferta-laboral-add');
})

router.post('/oferta-laboral-add', function(req, res) {  
    let titulo = req.body.ol_titulo;
    let descripcion = req.body.ol_descripcion;
    let horario = req.body.ol_horario;
    let inicioConvocatoria = req.body.inicioConvocatoria ? new Date(req.body.inicioConvocatoria) : null;
    let finConvocatoria = req.body.finConvocatoria ? new Date(req.body.finConvocatoria) : null;
    let inicioLaboral = req.body.inicioLaboral ? new Date(req.body.inicioLaboral) : null;
  
    let salario = req.body.ol_salario;

    var form_data = {
        ol_titulo: titulo,
        ol_descripcion: descripcion,
        ol_horario: horario,
        ol_fecha_creacion: new Date(), // Puedes asignar la fecha actual aquí
        ol_fecha_inicio_convocatoria: inicioConvocatoria,
        ol_fecha_fin_convocatoria: finConvocatoria,
        ol_fecha_inicio_laborales: inicioLaboral,
        ol_estado: null, // Asegúrate de proporcionar el valor adecuado para el estado
        ol_salario: salario,
        ep_id: null // Asegúrate de proporcionar el valor adecuado para la empresa

    }

    dbConn.query('INSERT INTO oferta_laboral SET ?', form_data, function(err, result) {
        if (err) {
            req.flash('error', err)
            console.log(form_data);
        } else {                
            req.flash('success','Oferta agregada correctamente');
            res.redirect('../admin/oferta-laboral');
        }
    })

})



router.get('/postulante', function(req, res, next) {
    dbConn.query('SELECT * FROM egresados ORDER BY eg_id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('admin/postulantes-list',{data:''});   
        } else {
            res.render('admin/postulantes-list',{data:rows});
        }
    });
});  


module.exports = router;
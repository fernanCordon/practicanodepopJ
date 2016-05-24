'use strict';

let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');

// Auth con JWT
let jwtAuth = require('../../lib/jwtAuth');
// router.use(jwtAuth());



router.get('/', function(req, res) {

    //console.log('jwt decoded', req.decoded);

    let start = parseInt(req.query.start) || 0;

    // nuestro api devuelve 1000 registros como máximo en cada llamada
    let limit = parseInt(req.query.limit) || 1000;

    // Sino pongo nada en sort se ordenará por _id
    let sort = req.query.sort || '_id';

    let includeTotal = req.query.includeTotal === 'true';

    let filters = {};

    if (typeof req.query.tag !== 'undefined') {
        filters.tags = req.query.tag;
    }

    if (typeof req.query.venta !== 'undefined') {
        filters.venta = req.query.venta;
    }

    if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {

        // Si satá puesto el guión '-' puede haber 2 numeros
        if (req.query.precio.indexOf('-') !== -1) {

            filters.precio = {};

            // cortamos la cadena por el '-' para ver los 2 números
            let rango = req.query.precio.split('-');

            // Si hay un número a la izda: buscar precios mayores que él
            if (rango[0] !== '') {
                filters.precio.$gte = rango[0];
            }

            // Si hay un número a la dcha: buscar precios menores que él
            if (rango[1] !== '') {
                filters.precio.$lte = rango[1];
            }

        // Si no hay guión '-'  solo hay un número: se busca ese número
        } else {
            filters.precio = req.query.precio;
        }
    }

    if (typeof req.query.nombre !== 'undefined') {
        
        // Mediante esta expresión regular encontraremos anuncios cuyo noambre empiece
        // por las letras que hemos escrito
        
        filters.nombre = new RegExp('^' + req.query.nombre, 'i');
    }

    Anuncio.list(start, limit, sort, includeTotal, filters, function(err, result) {
        if (err) {
            return res.status(500).json({ok: false, error: {code: 500, message: err.message}});
        }

        res.json({ok: true, result: result});
    });
});


// Devuelve la lista de tags disponibles (GET /anuncios/tags).
// Llamo a la función allowedTags que está en Anuncios.

router.get('/tags', function(req, res) {
    res.json({ok: true, allowedTags: Anuncio.allowedTags()});
});



module.exports = router;

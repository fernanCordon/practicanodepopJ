'use strict';

let mongoose = require('mongoose');

// módulo del archivo local_config.js
// Traigo el método anuncios (para poner la ruta de las fotos

var configAnuncios = require('../local_config').anuncios;

let anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: { type: Boolean, index: true },
    precio: { type: Number, index: true },
    foto: String,
    tags: { type: [String], index: true }
});

/**
 * lista de tags permitidos
 */
anuncioSchema.statics.allowedTags = function() {
    
    return ['work', 'lifestyle', 'motor', 'mobile'];
};

/**
 * carga un json de anuncios
 */
anuncioSchema.statics.cargaJson = function(fichero, cb) {
    
    let fs = require('fs');
    
    // En flowControl.js he creado una función recursiva
    let flow = require('../lib/flowControl');

    // Encodings: https://nodejs.org/api/buffer.html
    fs.readFile(fichero, {encoding:'utf8'}, function(err, data) {
        if (err) {
            return cb(err);
        }

        console.log(fichero + ' leido.');

        if (data) {

            let anuncios = JSON.parse(data).anuncios;
            let numAnuncios = anuncios.length;

            //Llamo a la función serialArray de flowControl.js y le paso el array de
            // anuncios, la función para que los cree (que está debajo) y el callBack final.
            
            flow.serialArray(anuncios, Anuncio.createRecord, (err)=> {
                if (err) {
                    return cb(err);
                }

                return cb(null, numAnuncios);
            });

        } else {
            return cb(new Error(fichero + ' está vacio!'));
        }
    });
};

// Para grabar los anuncios (es llamada desde la función cargaJson

anuncioSchema.statics.createRecord = function(nuevo, cb) {
    new Anuncio(nuevo).save(cb);
};



anuncioSchema.statics.list = function(startRow, numRows, sortField, includeTotal, filters, cb) {

    let query = Anuncio.find(filters);

    query.sort(sortField);

    query.skip(startRow);

    query.limit(numRows);

    //query.select('nombre venta');

    return query.exec(function(err, rows) {

        if (err) { return cb(err);}

        // poner prefijo a imagenes

        rows.forEach((row)=> {
            if (row.foto) {
               // local_config.js es un objeto con dos elementos.
                // El segundo se llama anuncios y es un objeto imagesURLBasePath.
                // Ese objeto contiene '/images/anuncios/'
                row.foto = configAnuncios.imagesURLBasePath + row.foto;
            }
        });

        let result = {rows: rows};

        if (!includeTotal) {
            return cb(null, result);
        }
        

        // incluir propiedad total para poner el número de anuncios que han salido
        // Para ello llamo a getCount que está debajo
        
        Anuncio.getCount({}, function(err, total) {
            if (err) {return cb(err);}

            result.total = total;
            return cb(null, result);
        });
    });
};

anuncioSchema.statics.getCount = function(filter, cb) {
    
    return Anuncio.count(filter, cb);
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);

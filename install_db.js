// Este script es para inicializar la base de datos y borrar lo que hubiese.
// Se lanza con el comando:  npm run installDB

'use strict';

var mongoose = require('mongoose');
var readLine = require('readline');
var async = require('async');

var db = require('./lib/connectMongoose');

// Cargamos las definiciones de todos nuestros modelos

require('./models/Anuncio');
require('./models/Usuario');
require('./models/PushToken');



db.once('open', function() {

    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure you want to empty DB? (no) ', function(answer) {
        rl.close();
        if (answer.toLowerCase() === 'yes') {
            runInstallScript();
        } else {
            console.log('DB install aborted!');
            return process.exit(0);
        }
    });

});

function runInstallScript() {

    async.series([
        initAnuncios,
        initUsuarios
        ], (err) => {
            if (err) {
                console.error('Hubo un error: ', err);
                return process.exit(1);
            }

            return process.exit(0);
        }
    );

}


// Para cargar los anuncios que tengo en el fichero "anuncios.json"

function initAnuncios(cb) {
    
    var Anuncio = mongoose.model('Anuncio');

    Anuncio.remove({}, ()=> {

        console.log('Anuncios borrados.');

        // Cargar anuncios.json
        var fichero = './anuncios.json';
        
        console.log('Cargando ' + fichero + '...');
        

        Anuncio.cargaJson(fichero, (err, numLoaded)=> {
            if (err) {
                return cb(err);
            }

            console.log(`Se han cargado ${numLoaded} anuncios.`);
            return cb(null, numLoaded);
        });

    });

}


// Poner los usuarios iniciales

function initUsuarios(cb) {

    var Usuario = mongoose.model('Usuario');


    Usuario.remove({}, ()=> {

        var usuarios = [
            {nombre: 'Fernando', email: 'fcordon@pin.upv.es', clave: '000000'},
            {nombre : "Violeta", email: "violeta22@gmail.com", clave : "111111"},
        ];


        // Recorre la lista de usuarios (como si fuese un for, pero hay asincronía)
        // y llama a la función createRecord de Usuario
        
        async.eachSeries(usuarios, Usuario.createRecord, (err)=> {
            if (err) {
                return cb(err);
            }

            console.log(`Se han cargado ${usuarios.length} usuarios.`);
            
            return cb(null, usuarios.length);
        });

    });
}

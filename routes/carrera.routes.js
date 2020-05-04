// routes/prticipantes.routes.js

const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const carreraSchema = require("../models/hipismo/Carrera");
const jornadaSchema = require('../models/hipismo/Jornada');
const Participante = mongoose.model('Participante');
const authorize = require("../middlewares/auth");
const PATH_CARRERAS = "/carreras";
const Ejemplar = mongoose.model('Ejemplar');
const Jinete = mongoose.model('Jinete');
const Entrenador = mongoose.model('Entrenador');

// Get ALL Participantes
router.route(PATH_CARRERAS).get((req, res) => {
    carreraSchema.find((error, carrera) => {
        if (error) {
            return next(error)
        } else {
        	Participante.populate(carrera , {path : "participantes"} , function(err , response){
            			res.status(200).json(response);
        	});
        }
    })
})

// GET carrera por id
router.route(PATH_CARRERAS +'/:id').get(authorize, (req, res, next) => {
    carreraSchema.findById(req.params.id, (error, carrera) => {
        if (error) {
            return next(error);
        } else {
            Participante.populate(carrera , {path : "participantes"} , function(err , ejemplar){
                Ejemplar.populate(ejemplar , {path : "participantes.ejemplar"} , function(err , jinete){
                    Jinete.populate(jinete , {path : "participantes.jinete"} , function(err , entrenador){
                        Entrenador.populate(entrenador , {path : "participantes.entrenador"} , function(err , data){
                            let sortParticipante = data.participantes;
                            sortParticipante.sort(function (a, b) {
                              if (a.numero > b.numero) return 1;
                              
                              if (a.numero < b.numero) return -1;
                              return 0;
                            });
                            res.status(200).json({
                                msg: 'ok',
                                data : data
                            });
                        });
                    });
                });
            });
        }
    });
});

// Crear carrera e inserta en jornada
router.post(PATH_CARRERAS,(req, res, next) => {
    var jornadaId = req.body.parentJornada;
    const carrera = new carreraSchema({
    	cod : 			req.body.cod,
    	numero : 		req.body.numero,
    	is_val : 		req.body.is_val,
    	val_num : 		req.body.val_num,
    	distancia : 	req.body.distancia,
        hora : 			req.body.hora,
        surface:        req.body.surface,
        parentJornada : jornadaId
    });
    let query = {"_id": jornadaId};
	var carreras;
	jornadaSchema.findById(jornadaId, (error, data) => {
        if (error) {
            return next(error);
        } else {
        	carreras = data.carrera;
    		carreras.push(carrera._id);
    		carrera.save().then((response) => {
		    	
		    	jornadaSchema.updateOne(query,
		    	{ 
		    		$set : { "carrera" : carreras}
		    	}, (error, data) => {
			        if (error) {
			            return next(error);
			            console.log(error)
			        } else {
			            res.json({
			            	data, 
			            	id : jornadaId,
			            	msg : 'Carrera creada exitosamente'
			            });
			            console.log('Carrera insertada en la Jornada');
			        }
			    });

		    }).catch(error => {
		        res.status(500).json({
		            error: error
		        });
		    });  

        }
    });
      
});

// Update Carrera
router.route(PATH_CARRERAS +'/:id').put((req, res, next) => {

    let query = {"_id": req.params.id};
    console.log('update carrera');
    console.log(req.body);
    carreraSchema.updateOne(query , {$set : req.body} , (error , update)  => {
         if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: 'Carrera actualizada exitosamente',
                data: update,
                status: 'OK'
            });
        }
    });
});

//Delete Carrera por Id
router.route(PATH_CARRERAS + '/:id').delete((req, res, next) => {
    console.log(req.params.id);
    carreraSchema.deleteOne({"_id": req.params.id }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: 'Carrera Eliminada exitosamente',
                data: data
            })
        }
    });
});

module.exports = router;
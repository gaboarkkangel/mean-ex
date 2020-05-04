// routes/prticipantes.routes.js

const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const jornadaSchema = require("../models/hipismo/Jornada");
const carreraSchema = require('../models/hipismo/Carrera');
const pollaSchema = require('../models/hipismo/Polla');
const pollaCombinacionesSchema = require('../models/hipismo/PollaCombinacion');
const participanteSchema = require('../models/hipismo/Participante');
const Hipodromo = mongoose.model('Hipodromo');
const Carrera = mongoose.model('Carrera');
const Participante = mongoose.model('Participante');
const Ejemplar = mongoose.model('Ejemplar');
const Entrenador = mongoose.model('Entrenador');
const Jinete = mongoose.model('Jinete');
const Polla = mongoose.model('Polla');
const { check, validationResult } = require('express-validator');
const authorize = require("../middlewares/auth");


const PATH_JORNADA = "/jornadas";

// Get ALL Jornal
router.route(PATH_JORNADA).get((req, res) => {
    jornadaSchema.find((error, jornada) => {
        if (error) {
            return next(error)
        } else {
            jornada.forEach(j => {
                if(j.status == "0"){
                    j.status = "Por Correr";
                }
            });

        	Hipodromo.populate(jornada , {path : "hipodromo"} , function(err , pollas){
                Polla.populate(pollas , { path : "polla"} , function(err , combinaciones){
                    pollaCombinacionesSchema.populate(combinaciones , { path : "polla.pollaCombinaciones"} , function(err , hipodromo){
                		Carrera.populate(hipodromo , {path : "carrera"}, function(err , carrera){
                			Participante.populate(carrera, { path : "carrera.participantes"}, function(err , participante){
                				Ejemplar.populate(participante , {path : "carrera.participantes.ejemplar"} , function(err , ejemplar){
                					Entrenador.populate(ejemplar , {path : "carrera.participantes.entrenador"} , function(err , entrenador){
                						Jinete.populate(entrenador , { path : "carrera.participantes.jinete"} , function(err , response){
                                            response.sort(function (a, b) {
                                                  if (a.fecha < b.fecha) return 1;
                                                  
                                                  if (a.fecha > b.fecha) return -1;
                                                  return 0;
                                                });
                                            res.status(200).json(response);
                                        });
                					})
                				});
                			});
                		}); 
                    });
        		});
        	});
        }
    });
});

// GET jornadas por id
router.route(PATH_JORNADA +'/:id').get(authorize, (req, res, next) => {
    jornadaSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            Hipodromo.populate(data , {path : "hipodromo"} , function(err , pollas){
                Polla.populate(pollas , { path : "polla"} , function(err , combinaciones){
                    pollaCombinacionesSchema.populate(combinaciones , { path : "polla.pollaCombinaciones"} , function(err , hipodromo){
                        Carrera.populate(hipodromo , {path : "carrera"}, function(err , carrera){
                            Participante.populate(carrera, { path : "carrera.participantes"}, function(err , participante){
                                Ejemplar.populate(participante , {path : "carrera.participantes.ejemplar"} , function(err , ejemplar){
                                    Entrenador.populate(ejemplar , {path : "carrera.participantes.entrenador"} , function(err , entrenador){
                                        Jinete.populate(entrenador , { path : "carrera.participantes.jinete"} , function(err , response){
                                            let sortCarrera = participante.carrera;
                                            sortCarrera.forEach(c => {
                                                if(c.status == "0"){
                                                    c.status = "Por Correr";
                                                }
                                            });
                                            sortCarrera.sort(function (a, b) {
                                              if (a.numero > b.numero) return 1;
                                              
                                              if (a.numero < b.numero) return -1;
                                              return 0;
                                            });
                                            res.status(200).json({
                                                msg: 'ok',
                                                data : response
                                            });
                                        });
                                    });
                                }); 
                            }); 
                        });
                    });
                });
            });
        }
    });
});

//Guardar Jornada and polla if isPolla

router.post(PATH_JORNADA,(req, res, next) => {
    let isPolla = req.body.polla;
    if (isPolla) {
        const polla = new pollaSchema({
        });
        polla.save().then((polla) => {
           const jornada = new jornadaSchema({
                fecha : new Date(req.body.fecha),
                hipodromo : req.body.hipodromo,
                polla : polla._id
            });
            jornada.save().then((response) => {
                res.status(201).json({
                    msg: "Jornada Creada Exitosamente!",
                    result: response
                });
            }).catch(error => {
                res.status(500).json({
                    error
                });
            });
        }).catch(error => {
            res.status(500).json({
                error
            });
        });

    } else {

        const jornada = new jornadaSchema({
        fecha : new Date(req.body.fecha),
        hipodromo : req.body.hipodromo,
        polla : null
    });
        console.log(jornada);
        jornada.save().then((response) => {
            res.status(201).json({
                msg: "Jornada Creada Exitosamente!",
                result: response
            });
        }).catch(error => {
            res.status(500).json({
                error
            });
        }); 
    }
       
});

//DELETE Jornada
router.route(PATH_JORNADA + '/:id').delete((req, res, next) => {
    console.log(req.params.id);
    jornadaSchema.deleteOne({"_id": req.params.id }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: 'Jornada Eliminada exitosamente',
                data: data
            });
        }
    });
});
// Delete carrera en jornada y carrera schema y participantes schema
router.put(PATH_JORNADA + '/deleteCarrera',(req, res, next) => {

    let jornalId = req.body.jornal;
    let carreraId = req.body.carrera;
    let query = {"_id": jornalId};
    jornadaSchema.findById(jornalId, (error, data) => {
        if (error) {
            return next(error);
        } else {

            let carreras = data.carrera;
            var i = carreras.indexOf( carreraId );
            i !== -1 && carreras.splice( i, 1 );

            jornadaSchema.updateOne(query,
            { 
                $set : { "carrera" : carreras}
            }, (error, deleteData) => {
                if (error) {
                    return next(error);
                } else {

                    participanteSchema.deleteMany({parentCarrera : carreraId} , (error , delParticipante) => {
                        if (error) {
                            return next(error);
                        } else {
                            carreraSchema.deleteOne({"_id": carreraId }, (error, data) => {
                                if (error) {
                                    return next(error);
                                } else {
                                    res.status(200).json({
                                        msg: 'Carrera Eliminada exitosamente',
                                        data: data
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Delete carrera en jornada y carrera schema y participantes schema
router.route(PATH_JORNADA + '/deleteJornada/:id').delete((req, res, next) => {

    let jornadaId = req.params.id;

    jornadaSchema.findById(jornadaId, (error, jornada) => {

        if(error){
            return next(error);
        } else {
            console.log(jornada.carrera);
            participanteSchema.deleteMany({parentCarrera: {$in: jornada.carrera}} , (error , delParticipante) => {
                if(error){
                    return next(error);
                } else {
                    console.log(delParticipante);
                    carreraSchema.deleteMany({parentJornada : jornadaId} , (error , deleteCarrera) => {
                        jornadaSchema.deleteOne({"_id": req.params.id }, (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                console.log(deleteCarrera);
                                res.status(200).json({
                                    msg: 'Jornada Eliminada exitosamente',
                                    participante: delParticipante,
                                    carrera: deleteCarrera,
                                    jornada: data,
                                    status: 'OK'
                                });
                            }
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;
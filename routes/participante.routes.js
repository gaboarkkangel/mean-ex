// routes/prticipantes.routes.js

const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const participanteSchema = require("../models/hipismo/Participante");
const Ejemplar = mongoose.model('Ejemplar');
const Entrenador = mongoose.model('Entrenador');
const Jinete = mongoose.model('Jinete');
const carreraSchema = require("../models/hipismo/Carrera");


const PATH_PARTICIPANTE = "/participantes";
// Get ALL Participantes
router.route(PATH_PARTICIPANTE).get((req, res) => {
    participanteSchema.find((error, participante) => {
        if (error) {
            return next(error)
        } else {
        	Ejemplar.populate(participante , {path : "ejemplar"} , function(err , ejemplar){
        		Entrenador.populate(ejemplar , {path : "entrenador"} , function(err , entrenador){
        			Jinete.populate(entrenador, {path : "jinete"} , function(err , response){
            			res.status(200).json(response);
        			});
        		});
        	});
        }
    })
});

// Post Participante y agregar en carrera
router.post(PATH_PARTICIPANTE,(req, res, next) => {
    const idCarrera = req.body.carrera;
    const participante = new participanteSchema({
        ejemplar        : req.body.ejemplar,
        entrenador      : req.body.entrenador,
        jinete          : req.body.jinete,
        numero          : req.body.numero,
        pp              : req.body.pp,
        parentCarrera   : req.body.carrera
    });
    console.log(participante);
    var query = {"_id": idCarrera};
    var participantes;
    carreraSchema.findById(idCarrera, (error, data) => {
        if (error) {
            return next(error);
        } else {

            participantes = data.participantes;
            participantes.push(participante._id);

            participante.save().then((response) => {

                carreraSchema.updateOne(query,
                { 
                    $set : { "participantes" : participantes}
                }, (error, data) => {
                    if (error) {
                        return next(error);
                        console.log(error)
                    } else {
                        res.json({
                            data, 
                            msg : 'Participante Inscrito exitosamente',
                            status : 'Ok'
                        });
                        console.log('Participante Inscrito exitosamente');
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

// Delete participante en carrera y participante schema
router.put(PATH_PARTICIPANTE + '/deleteParticipante',(req, res, next) => {

    let carreraId = req.body.carrera;
    let participanteId = req.body.participante;
    let query = {"_id": carreraId};

    carreraSchema.findById(carreraId, (error, data) => {
        if (error) {
            return next(error);
        } else {

            let participantes = data.participantes;
            var i = participantes.indexOf( participanteId );
            i !== -1 && participantes.splice( i, 1 );

            carreraSchema.updateOne(query,
            { 
                $set : { "participantes" : participantes}
            }, (error, deleteData) => {
                console.log(deleteData);
                if (error) {
                    return next(error);
                } else {
                    participanteSchema.deleteOne({"_id": participanteId }, (error, data) => {
                        if (error) {
                            return next(error);
                        } else {
                            res.status(200).json({
                                msg: 'Participante Retirado exitosamente',
                                data: data,
                                status : 'Ok'
                            })
                        }
                    });
                }
            });
        }
    });
});

// resultados Participante and set carrera result 1
router.put(PATH_PARTICIPANTE + '/setResult',(req, res, next) => {
   let query = [];
   console.log(req.body.carreraId);
   if(req.body.primero && req.body.segundo && req.body.tercero && req.body.cuarto){

   query[1] = {"_id" : req.body.primero};
   query[2] = {"_id" : req.body.segundo};
   query[3] = {"_id" : req.body.tercero};
   query[4] = {"_id" : req.body.cuarto};

   participanteSchema.updateMany({parentCarrera : req.body.carreraId} , {$set : {position : '0'}}, (error, update) => {
    if(error) {
        console.log(error);
        return next(error);
    } else {
        console.log(update);
        for (var i = 0; i < 4; i++) {
        participanteSchema.updateOne(query[i+1] , {$set : {position : (i+1).toString()}} , (error , update)  => {
                if(error){
                    console.log(error);
                    return next(error);
                } else {
                    console.log(update);
                }
            });
        }
        carreraSchema.updateOne({_id : req.body.carreraId} , {$set : {result : '1'}}, (error, update) => {
            res.status(200).json({
                msg: 'Resultados actualizado exitosamente',
                status: 'OK',
                query
            });
        });
      }
   });
  } else {
    res.status(200).json({
        msg: 'Participante invalido',
        status: 'error',
    });
  }
});

// Update Participante
router.route(PATH_PARTICIPANTE +'/:id').put((req, res, next) => {

    let query = {"_id": req.params.id};
    console.log('update Participantessss');
    console.log(req.body);
    participanteSchema.updateOne(query , {$set : req.body} , (error , update)  => {
         if (error) {
            console.log(error);
            return next(error);
        } else {
            res.status(200).json({
                msg: 'Participante actualizado exitosamente',
                data: update,
                status: 'OK'
            });
        }
    });
});



module.exports = router;
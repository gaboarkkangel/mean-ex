// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const entrenadorSchema = require("../models/hipismo/Entrenador");
const { check, validationResult } = require('express-validator');

const PATH_ENTRENADOR = "/entrenadores";
// Get Users
router.route(PATH_ENTRENADOR).get((req, res) => {
    entrenadorSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

router.route(PATH_ENTRENADOR + '/name/:term').get((req, res) => {
    let query = req.params.term;
    entrenadorSchema.find({name : {$regex: `${query}`, $options:'i' }}, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(response);  
        }
    });
});

//POST guardar Entrenador

router.post(PATH_ENTRENADOR, (req , res, next) => {

    let entrenador = new entrenadorSchema({
        name : (req.body.name).toUpperCase()
    });

    console.log(entrenador);
    entrenador.save().then((response) => {
        res.json({
            data : response, 
            msg : 'Entrenador creada exitosamente',
            status : 'Ok'
        });
        console.log('Entrenador Guardado Exitosamente');

    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }); 

});

module.exports = router;
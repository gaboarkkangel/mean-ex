// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const ejemplarSchema = require("../models/hipismo/Ejemplar");
const { check, validationResult } = require('express-validator');

const PATH_EJEMPLAR = "/ejemplares";
// Get Users
router.route(PATH_EJEMPLAR).get((req, res) => {
    ejemplarSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

//GET Ejemplares por termino
router.route(PATH_EJEMPLAR+'/name/:term').get((req, res) => {
    let query = req.params.term;
    ejemplarSchema.find({name : {$regex: `${query}`, $options:'i' }}, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(response);  
        }
    });
});

//POST guardar Ejemplar

router.post(PATH_EJEMPLAR, (req , res, next) => {

    let ejemplar = new ejemplarSchema({
        name : (req.body.name).toUpperCase(),
        sexo : req.body.sexo,
        fnac : req.body.fnac
    });

    console.log(ejemplar);
    ejemplar.save().then((response) => {
        res.json({
            data : response, 
            msg : 'Ejemplar creada exitosamente',
            status : 'Ok'
        });
        console.log('Ejemplar Guardado Exitosamente');

    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }); 

});

module.exports = router;
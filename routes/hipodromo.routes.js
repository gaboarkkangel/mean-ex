// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const hipodromoSchema = require("../models/hipismo/Hipodromo");
const { check, validationResult } = require('express-validator');

const PATH_HIPODROMO = "/hipodromos";
// Get HIPODROMOS
router.route(PATH_HIPODROMO).get((req, res) => {
    hipodromoSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

//GET Hipodromos por termino
router.route(PATH_HIPODROMO+'/name/:term').get((req, res) => {
    let query = req.params.term;
    hipodromoSchema.find({name : {$regex: `${query}`, $options:'i' }}, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(response);  
        }
    });
});


//POST guardar Hipodromo
router.post(PATH_HIPODROMO, (req , res, next) => {

    let hipodromo = new hipodromoSchema({
        name : (req.body.name).toUpperCase(),
        city : req.body.city,
        state : req.body.state,
        country : req.body.country,
        address : req.body.address,
        metrica : req.body.metrica
    });

    console.log(hipodromo);
    hipodromo.save().then((response) => {
        res.json({
            data : response, 
            msg : 'Hipodromo creada exitosamente',
            status : 'Ok'
        });
        console.log('Hipodromo Guardado Exitosamente');

    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }); 

});

module.exports = router;
// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const jineteSchema = require("../models/hipismo/Jinete");
const { check, validationResult } = require('express-validator');

const PATH_JINETE = "/jinetes";
// Get Users
router.route(PATH_JINETE).get((req, res) => {
    jineteSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

router.route(PATH_JINETE + '/name/:term').get((req, res) => {
    let query = req.params.term;
    jineteSchema.find({name : {$regex: `${query}`, $options:'i' }}, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json(response);  
        }
    });
});

//POST guardar Jinet

router.post(PATH_JINETE, (req , res, next) => {

    let jinete = new jineteSchema({
        name : (req.body.name).toUpperCase()
    });

    console.log(jinete);
    jinete.save().then((response) => {
        res.json({
            data : response, 
            msg : 'Jinete creada exitosamente',
            status : 'Ok'
        });
        console.log('Jinete Guardado Exitosamente');

    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }); 

});

module.exports = router;
// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const inscritoSchema = require("../models/hipismo/Inscrito");
const { check, validationResult } = require('express-validator');

const PATH_INSCRITOS = "/inscritos";
// Get Users
router.route(PATH_INSCRITOS).get((req, res) => {
    inscritoSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

module.exports = router;